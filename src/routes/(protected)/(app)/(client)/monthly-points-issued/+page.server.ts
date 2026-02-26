import type { IssuedLogs } from '$lib/types/data';
import type { PageServerLoad } from './$types';

interface LateReport {
    minutes: number;
    date: string;
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

    const rows = data ?? []

    const lateReport: LateReport | undefined = rows[0]
        ? { minutes: rows[0].late_per_mins, date: rows[0].created_at }
        : undefined

    const formattedLogs: IssuedLogs[] = rows.map(i => ({
        uuid: i.uuid,
        created_at: i.created_at,
        late_per_mins: i.late_per_mins,
        sick_leave_earned: i.sick_leave_earned,
        vacation_leave_earned: i.vacation_leave_earned,
        sick_leave_balance: i.sick_leave_balance,
        vacation_leave_balance: i.vacation_leave_balance,
        employee_uuid: i.employee_uuid,
        deducted_late: i?.deducted_late
    }))

    return {
        lateReport,
        issuedLogs: formattedLogs
    };
}) satisfies PageServerLoad;