import type { CreditPointsInfo, RecentReports } from '$lib/types/data';
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

    if (currentPointsError) {
        console.log("Fetching Data Error:", currentPointsError)
    } else {
        creditInfo = {
            id: currentPoints?.id,
            created_at: currentPoints?.created_at,
            updated_at: currentPoints?.credit_monthly_issued?.created_at,
            late_per_mins: currentPoints?.credit_monthly_issued?.late_per_mins,
            sick_leave_points: currentPoints?.sick_leave_points,
            vacation_leave_points: currentPoints?.vacation_leave_points
        }
    }

    let recentReports: RecentReports[] = []

    // Getting the latest 5 monthly issued reports
    const { data: issuedLogs, error: issuedLogsError } = await locals.supabase
        .from('credit_monthly_issued')
        .select()
        .eq('employee_uuid', employee?.uuid)
        .order('created_at', { ascending: false })
        .limit(5)


    let recentIssuedLogs: RecentReports[] = []

    if (issuedLogsError) {
        console.log("Fetching Data Error:", issuedLogsError)
    } else {
        recentIssuedLogs = issuedLogs.map(i => ({
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


    recentReports = [...recentIssuedLogs]


    return {
        creditInfo,
        recentReports
    };
}) satisfies PageServerLoad;