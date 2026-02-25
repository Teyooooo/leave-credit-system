import type { LeaveBalanceSheet } from '$lib/types/data';
import type { PageServerLoad } from './$types';

export const load = (async ({locals, parent}) => {
    const { employee } = await parent()

    let { data: credit_monthly_issued, error } = await locals.supabase
    .from('credit_monthly_issued')
    .select('*')
    .eq('employee_uuid', employee.uuid)
    .order('created_at', {ascending: true})

    let balanceSheetData: LeaveBalanceSheet[] = []
    if(!error){
        console.log({credit_monthly_issued})
        balanceSheetData = credit_monthly_issued?.map(i => ({
            uuid: i?.uuid,
            created_at: i?.created_at,
            employee_uuid: i?.employee_uuid,
            late_per_mins: i?.late_per_mins,
            sick_leave_earned: i?.sick_leave_earned,
            vacation_leave_earned: i?.vacation_leave_earned,
            sick_leave_balance: i?.sick_leave_balance,
            vacation_leave_balance: i?.vacation_leave_balance,
            remarks: i?.remarks ?? ' ',
            total_vacation_leave_points_used: 0,
            total_sick_leave_points_used: 0
        })) ?? []
    }
          


    return {
        balanceSheetData
    };
}) satisfies PageServerLoad;