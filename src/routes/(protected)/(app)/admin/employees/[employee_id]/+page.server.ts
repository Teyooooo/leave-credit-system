import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { CreditPointsInfo, IssuedLogs } from '$lib/types/data';

export const load = (async ({ params, parent, locals }) => {
    const { employee_id } = params
    const { employees } = await parent()
    const current_employee = employees.find(employee => 
        employee.employee_id === Number(employee_id)
        );

    console.log({employee_id, current_employee})

    const { data: currentPoints, error: currentPointsError } = await locals.supabase
        .from('credit_points')
        .select()
        .eq('employee_uuid', current_employee?.uuid)


    if(currentPointsError){
        console.log("Fetching Data Error:", currentPointsError)
        return fail(500, {
            error: true,
            message: "Failed to fetch data to server."
        })
    }


    const { data: logsIssued, error: logsIssuedError } = await locals.supabase
        .from('credit_monthly_issued')
        .select()
        .eq('employee_uuid', current_employee?.uuid)

    if(logsIssuedError){
        console.log("Fetching Data Error:", currentPointsError)
        return fail(500, {
            error: true,
            message: "Failed to fetch data to server."
        })
    }

    const formattedLogs: IssuedLogs[] = logsIssued?.map(i=>({
        uuid: i.uuid,
        created_at: i.created_at,
        late_per_mins: i.late_per_mins,
        sick_leave_earned: i.sick_leave_earned,
        vacation_leave_earned: i.vacation_leave_earned,
        sick_leave_balance: i.sick_leave_balance,
        vacation_leave_balance: i.vacation_leave_balance,
        remarks: i.remarks || '-',
        employee_uuid: i.employee_uuid
    })) || []

    // Handle empty credit points - use default/null values
    let creditPoints: CreditPointsInfo | undefined = undefined;
    
    if (currentPoints && currentPoints.length > 0) {
        const currentMonthlyIssued = logsIssued?.find((e) => e.uuid === currentPoints[0].current_month_issued)
        // const monthlyIssued = currentPoints[0].credit_monthly_issued?.[0];

        console.log({currentMonthlyIssued})
        
        creditPoints = {
            id: currentPoints[0].id,
            created_at: currentPoints[0].created_at,
            updated_at: currentMonthlyIssued?.created_at,
            late_per_mins: currentMonthlyIssued?.late_per_mins || 0,
            sick_leave_points: currentPoints[0].sick_leave_points,
            vacation_leave_points: currentPoints[0].vacation_leave_points
        };
    }

    console.log({logsIssued})
    
    return {
        params: employee_id,
        current_employee_info: current_employee,
        creditPoints,
        issuedLogs: formattedLogs
    };
}) satisfies PageServerLoad;

export const actions: Actions = {
    add_credits: async ({request, locals}) => {
        const formData = await request.formData()
        const employee_uuid = formData.get('uuid')
        const vacation_leave_earned = Number(formData.get('vacation_leave'))
        const sick_leave_earned = Number(formData.get('sick_leave')) 
        const late_per_mins = Number(formData.get('balance_brought_forward'))
        const remarks = formData.get('remarks')
        const sick_leave_balance = Number(formData.get('sick_leave_balance'))
        const vacation_leave_balance = Number(formData.get('vacation_leave_balance'))

        // add to database
        const { data, error: errorMonthlyIssued } = await locals.supabase
            .from('credit_monthly_issued')
            .insert({
                employee_uuid,
                vacation_leave_earned,
                sick_leave_earned,
                late_per_mins,
                remarks,
                sick_leave_balance,
                vacation_leave_balance
            })
            .select('uuid')

        if(errorMonthlyIssued){
            return fail(500, {
                error: true,
                message: "Failed to push monthly issued. Try again later."
            })

        }
        
        console.log({data})
        const monthly_issued_uuid = data[0].uuid

        // Try to increment the existing balance
        const { data: updateData, error: errorIncrementExisting } = await locals.supabase
            .from('credit_points')
            .update({
                vacation_leave_points: vacation_leave_balance + vacation_leave_earned,
                sick_leave_points: sick_leave_balance + sick_leave_earned,
                current_month_issued: monthly_issued_uuid
            })
            .eq('employee_uuid', employee_uuid)
            .select() // Important: select to get returned rows

        // If no rows were updated (employee doesn't have a credit_points record yet), insert new one
        if(errorIncrementExisting || !updateData || updateData.length === 0){
            console.log('No existing record found, inserting new one...')

            const { error } = await locals.supabase
                .from('credit_points')
                .insert({
                    vacation_leave_points: vacation_leave_balance + vacation_leave_earned,
                    sick_leave_points: sick_leave_balance + sick_leave_earned,
                    current_month_issued: monthly_issued_uuid,
                    employee_uuid
                })

            if(error){
                console.error('Insert error:', error)
                return fail(500, {
                    error: true,
                    message: "Failed to increment balances. Try again later."
                })
            }
        }


        return { success: true }
    }
};