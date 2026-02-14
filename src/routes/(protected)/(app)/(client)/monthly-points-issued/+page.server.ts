import type { IssuedLogs } from '$lib/types/data';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

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
        return fail(500, {
            error: true,
            message: "Failed to fetch data to server."
        })
    }

    interface LateReport {
        minutes: number,
        date: string
    }

    const lateReport:LateReport = {
        minutes: data[0].late_per_mins,
        date: data[0].created_at
    }

    const formattedLogs: IssuedLogs[] = data?.map(i => ({
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

    return {
        lateReport,
        issuedLogs: formattedLogs
    };
}) satisfies PageServerLoad;