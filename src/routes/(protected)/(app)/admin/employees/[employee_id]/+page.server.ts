import { calculateLateDeduction, convertLateIntoDecimalDay, convertTimestamp } from '$lib';
import type { CreditPointsInfo, IssuedLogs, LeaveData } from '$lib/types/data';
import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ params, parent, locals }) => {
    const { current_employee_info: current_employee } = await parent()

    const { data: currentPoints, error: currentPointsError } = await locals.supabase
        .from('credit_points')
        .select()
        .eq('employee_uuid', current_employee?.uuid)
        .single()


    if (currentPointsError) {
        console.log("Fetching Data Error:", currentPointsError)
    } else {
        console.log({ currentPoints })
    }


    const { data: logsIssued, error: logsIssuedError } = await locals.supabase
        .from('credit_monthly_issued')
        .select()
        .eq('employee_uuid', current_employee?.uuid)

    if (logsIssuedError) {
        console.log("Fetching Data Error:", currentPointsError)
    }

    const formattedLogs: IssuedLogs[] = logsIssued?.map(i => ({
        uuid: i.uuid,
        created_at: i.created_at,
        late_per_mins: i.late_per_mins,
        sick_leave_earned: i.sick_leave_earned,
        vacation_leave_earned: i.vacation_leave_earned,
        sick_leave_balance: i.sick_leave_balance,
        vacation_leave_balance: i.vacation_leave_balance,
        employee_uuid: i.employee_uuid,
        deducted_late: i?.deducted_late,
        remarks: i?.remarks ?? '-',
        period: i?.period
    })) || []

    // Handle empty credit points - use default/null values
    let creditPoints: CreditPointsInfo | undefined = undefined;

    if (currentPoints) {
        const currentMonthlyIssued = logsIssued?.find((e) => e.uuid === currentPoints.current_month_issued)

        // Find the latest period by sorting period strings
        const latestPeriod = logsIssued
            ?.map(log => log.period)
            .sort((a, b) => new Date(`01 ${b}`).getTime() - new Date(`01 ${a}`).getTime())[0]

        // Get all items in that latest period
        const latestPeriodLogs = logsIssued?.filter(log => log.period === latestPeriod)

        // Sum up late_per_mins in the latest period
        const totalLatePerMins = latestPeriodLogs?.reduce((sum, log) => sum + (log.late_per_mins || 0), 0) ?? 0

        console.log({ currentMonthlyIssued, currentPoints })

        // find the latest period
        // add all the late_per_mins in that period

        creditPoints = {
            id: currentPoints.id,
            created_at: currentPoints.created_at,
            updated_at: currentMonthlyIssued?.created_at,
            period: latestPeriod,
            late_per_mins: totalLatePerMins || 0,
            sick_leave_points: currentPoints.sick_leave_points,
            vacation_leave_points: currentPoints.vacation_leave_points
        };
    }

    console.log({ logsIssued })

    // Getting the list of leave types
    const { data: listsLeave, error: listsLeaveError } = await locals.supabase
        .from('types_of_leave')
        .select()

    let listsOfLeave: LeaveData[] = []
    if (listsLeaveError) {
        console.error("Database Error:", listsLeaveError)
    } else {
        listsOfLeave = listsLeave.map(item => ({
            uuid: item.uuid,
            name: item.name,
            entitlement: item.entitlement,
            description: item.description,
        }))
    }


    return {
        creditPoints,
        issuedLogs: formattedLogs,
        listsOfLeave
    };
}) satisfies PageServerLoad;

export const actions: Actions = {
    add_credits: async ({ request, locals }) => {
        const formData = await request.formData()
        const employee_uuid = formData.get('uuid')
        const vacation_leave_earned = Number(formData.get('vacation_leave'))
        const sick_leave_earned = Number(formData.get('sick_leave'))
        const late_per_mins = Number(formData.get('balance_brought_forward'))
        const sick_leave_balance = Number(formData.get('sick_leave_balance'))
        const vacation_leave_balance = Number(formData.get('vacation_leave_balance'))
        const remarks = formData.get('remarks')
        const period = formData.get('period') as string


        // deduct late to vacation_balance
        let deductedVacationBalance = vacation_leave_balance + vacation_leave_earned
        let convertedLate = 0
        if (late_per_mins > 0) {
            convertedLate = convertLateIntoDecimalDay(late_per_mins)
            const incrementedBalance = vacation_leave_balance + vacation_leave_earned
            deductedVacationBalance = calculateLateDeduction(convertedLate, incrementedBalance)
        }

        // add to database
        const { data, error: errorMonthlyIssued } = await locals.supabase
            .from('credit_monthly_issued')
            .insert({
                employee_uuid,
                vacation_leave_earned,
                sick_leave_earned,
                late_per_mins,
                sick_leave_balance,
                vacation_leave_balance,
                deducted_late: convertedLate.toFixed(3),
                remarks,
                period: convertTimestamp(period, 'monthYear')
            })
            .select('uuid')

        if (errorMonthlyIssued) {
            return fail(500, {
                error: true,
                message: "Failed to push monthly issued. Try again later."
            })

        }

        console.log({ data })
        const monthly_issued_uuid = data[0].uuid

        // Try to increment the existing balance
        const { data: updateData, error: errorIncrementExisting } = await locals.supabase
            .from('credit_points')
            .update({
                vacation_leave_points: deductedVacationBalance.toFixed(3),
                sick_leave_points: (sick_leave_balance + sick_leave_earned).toFixed(3),
                current_month_issued: monthly_issued_uuid
            })
            .eq('employee_uuid', employee_uuid)
            .select() // Important: select to get returned rows

        // If no rows were updated (employee doesn't have a credit_points record yet), insert new one
        if (errorIncrementExisting || !updateData || updateData.length === 0) {
            console.log('No existing record found, inserting new one...')

            const { error } = await locals.supabase
                .from('credit_points')
                .insert({
                    vacation_leave_points: deductedVacationBalance.toFixed(3),
                    sick_leave_points: (sick_leave_balance + sick_leave_earned).toFixed(3),
                    current_month_issued: monthly_issued_uuid,
                    employee_uuid
                })

            if (error) {
                console.error('Insert error:', error)
                return fail(500, {
                    error: true,
                    message: "Failed to increment balances. Try again later."
                })
            }
        }


        return { success: true }
    },
    issue_leave: async ({ request, locals }) => {
        const formData = await request.formData()
        console.log({ formData })

        const employee_name = formData.get('employee_name') as string
        const employee_id = formData.get('employee_id') as string
        const employee_uuid = formData.get('employee_uuid') as string
        const hr_uuid = formData.get('hr_uuid') as string
        const leave_start = formData.get('start_date') as string
        const leave_end = formData.get('end_date') as string
        const sick_leave_points = formData.get('sick_leave_points') as string
        const vacation_leave_points = formData.get('vacation_leave_points') as string
        const leave_uuid = formData.get('leave_uuid') as string
        const leave_title = formData.get('leave_title') as string
        const total_days = formData.get('total_days') as string


        // check is the leave is sick or vacation
        const where_to_update =
            leave_title === 'Sick Leave' ? 'sick_leave_points'
                : leave_title === 'Vacation Leave' ? 'vacation_leave_points'
                    : leave_title === 'Force Leave' ? 'vacation_leave_points'
                        : undefined

        const snapshot_points = leave_title === 'Sick Leave' ? `SLP: ${sick_leave_points} `
            : leave_title === 'Vacation Leave' ? `VLP: ${vacation_leave_points}`
                : leave_title === 'Force Leave' ? `VLP: ${vacation_leave_points}`
                    : null


        const { error } = await locals.supabase
            .from('issued_leave')
            .insert({
                employee_uuid,
                hr_uuid,
                leave_uuid,
                leave_start,
                leave_end,
                leave_points_snapshot: snapshot_points
            })

        if (error) {
            console.log({ error })
            return fail(500, {
                error: true,
                message: 'Failed to approve request. Try again later.'
            })
        }

        const updated_points = leave_title === 'Sick Leave' ? Number(sick_leave_points) - Number(total_days)
            : leave_title === 'Vacation Leave' ? Number(vacation_leave_points) - Number(total_days)
                : leave_title === 'Force Leave' ? Number(vacation_leave_points) - Number(total_days)
                    : 0

        if (where_to_update) {
            const { error: creditPointsError } = await locals.supabase
                .from('credit_points')
                .update({ [where_to_update]: updated_points })
                .eq('employee_uuid', employee_uuid)

            if (creditPointsError) {
                console.log({ error })
                return fail(500, {
                    error: true,
                    message: 'Failed to update points. Try again later.'
                })
            }
        }


        await locals.logActivity(`Issued leave application for ${employee_name} (ID: ${employee_id})`)

        return { success: true }
    }
};