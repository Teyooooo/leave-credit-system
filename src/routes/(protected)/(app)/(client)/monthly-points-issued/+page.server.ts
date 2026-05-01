import type { IssuedLogs } from '$lib/types/data';
import type { PageServerLoad } from './$types';

interface LateReport {
    minutes: number;
    period: string;
}

export const load = (async ({ locals, parent }) => {
    const parentData = await parent()
    const current_employee = parentData?.employee

    const { data, error } = await locals.supabase
        .from('credit_monthly_issued')
        .select()
        .eq('employee_uuid', current_employee?.uuid)
        .order('created_at', { ascending: false })

    if (error) {
        console.log("Fetching Data Error:", error)
        return {
            lateReport: undefined,
            issuedLogs: [] as IssuedLogs[]
        }
    }

    const logsIssued = data ?? []

    let lateReport: LateReport 

    const formattedLogs: IssuedLogs[] = logsIssued.map(i => ({
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
    }))

    // get the total of late
    // Find the latest period by sorting period strings
    const latestPeriod = logsIssued
        ?.map(log => log.period)
        .sort((a, b) => new Date(`01 ${b}`).getTime() - new Date(`01 ${a}`).getTime())[0]

    // Get all items in that latest period
    const latestPeriodLogs = logsIssued?.filter(log => log.period === latestPeriod)

    // Sum up late_per_mins in the latest period
    const totalLatePerMins = latestPeriodLogs?.reduce((sum, log) => sum + (log.late_per_mins || 0), 0) ?? 0

    lateReport = {
        minutes: totalLatePerMins,
        period: latestPeriod
    }
    

    return {
        lateReport,
        issuedLogs: formattedLogs
    };
}) satisfies PageServerLoad;