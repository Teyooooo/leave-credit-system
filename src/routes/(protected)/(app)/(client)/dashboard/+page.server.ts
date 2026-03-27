import type { CreditPointsInfo, IssuedLogs, RecentReports } from '$lib/types/data';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals, parent }) => {
    const { employee } = await parent()

    // Getting the current balance and late 
    const { data: currentPoints, error: currentPointsError } = await locals.supabase
        .from('credit_points')
        .select(`*, credit_monthly_issued( late_per_mins, created_at )`)
        .eq('employee_uuid', employee?.uuid)
        .single()

    let creditInfo: CreditPointsInfo | undefined = undefined

   // Getting the latest 5 monthly issued reports
    const { data: logsIssued, error: logsIssuedError } = await locals.supabase
        .from('credit_monthly_issued')
        .select()
        .eq('employee_uuid', employee?.uuid)
        .order('created_at', { ascending: false })
        .limit(20)

    let formattedLogs: IssuedLogs[] = []
    if (logsIssuedError) {
        console.log("Fetching Data Error:", currentPointsError)
    } else {
       formattedLogs  = logsIssued?.map(i => ({
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
    }

    if (currentPointsError) {
        console.log("Fetching Data Error:", currentPointsError)
    } else {
        // Find the latest period by sorting period strings
        const latestPeriod = logsIssued
            ?.map(log => log.period)
            .sort((a, b) => new Date(`01 ${b}`).getTime() - new Date(`01 ${a}`).getTime())[0]

        // Get all items in that latest period
        const latestPeriodLogs = logsIssued?.filter(log => log.period === latestPeriod)

        // Sum up late_per_mins in the latest period
        const totalLatePerMins = latestPeriodLogs?.reduce((sum, log) => sum + (log.late_per_mins || 0), 0) ?? 0

        creditInfo = {
            id: currentPoints?.id,
            created_at: currentPoints?.created_at,
            updated_at: currentPoints?.credit_monthly_issued?.created_at,
            late_per_mins: totalLatePerMins,
            period: latestPeriod,
            sick_leave_points: currentPoints?.sick_leave_points,
            vacation_leave_points: currentPoints?.vacation_leave_points
        }
    }

    let recentIssuedLogs: RecentReports[] = []
    if (formattedLogs.length > 0){
        recentIssuedLogs = formattedLogs.map(i => ({
            timestamp: i.created_at,
            type: "Monthly Report",
            details: `
            Leave earned — Vacation: ${i.vacation_leave_earned}, Sick: ${i.sick_leave_earned}. 
            Leave balances — Vacation: ${i.vacation_leave_balance}, Sick: ${i.sick_leave_balance}. 
            Lateness: ${i.late_per_mins} ${i.late_per_mins > 0 ? 'minutes' : 'minute'}.
            ${i.remarks ? `Remark: “${i.remarks}”` : ''} 
        `
        }))
    }



    return {
        creditInfo,
        recentReports: recentIssuedLogs
    };
}) satisfies PageServerLoad;