import { convertCalendarDate, getTotalDays } from '$lib';
import type { IssuedLeaveHistory } from '$lib/types/data';
import type { PageServerLoad } from './$types';

export const load = (async ({ parent, locals }) => {
    const { current_employee_info: employee } = await parent()

    const { data, error } = await locals.supabase
        .from('issued_leave')
        .select(`*, 
                hr_info: employees!hr_uuid( employee_name ),
                leave_info: types_of_leave!leave_uuid( name )
            `)
        .eq('employee_uuid', employee?.uuid)

    console.log({ data, error })

    let issuedLeave: IssuedLeaveHistory[] = []
    if (!error) {
        issuedLeave = data?.map(i => ({
            uuid: i?.uuid,
            created_at: i?.created_at,
            leave_title: i?.leave_info.name,
            leave_start: i?.leave_start,
            leave_end: i?.leave_end,
            total_days: getTotalDays(convertCalendarDate(i?.leave_start), convertCalendarDate(i?.leave_end)),
            leave_points_snapshot: i?.leave_points_snapshot,
            hr_uuid: i?.hr_uuid,
            hr_name: i?.hr_info.employee_name
        }))
    }

    return { issuedLeave };
}) satisfies PageServerLoad;