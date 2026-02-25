import type { LeaveHistory } from '$lib/types/data';
import { convertCalendarDate, getTotalDays } from '$lib/utils/helper';
import type { PageServerLoad } from './$types';

export const load = (async ({locals, parent}) => {
    const { employee } = await parent()

    if (!employee?.uuid) {
        console.log({employee})
        return { leaveHistory: [] };
    }

    const { data, error } = await locals.supabase
            .from('filed_leave')
            .select(`*, 
                hr: employees!hr_uuid( employee_name ), 
                leave_name: types_of_leave!type_of_leave( name ),
                employee_info: employees!employee_uuid( employee_name, department, position, employee_id, email, profile_pic_url )`
            )
            .in('status', ['Approve', 'Decline'])
            .eq('employee_uuid', employee.uuid)
            .order('date_filed', { ascending: false })
    
        
        let leaveHistory: LeaveHistory[] = []
          if(!error){
            console.log({data})

            leaveHistory = data?.map( i => ({
                employee_name: i?.employee_info?.employee_name,
                employee_id: i?.employee_info?.employee_id,
                employee_email: i?.employee_info?.email,
                employee_department: i?.employee_info?.department,
                employee_position: i?.employee_info?.position,
                profile_pic_url: i?.employee_info?.profile_pic_url,
                employee_points_id: i?.employee_uuid?.id ?? 0,
                sick_points: i?.employee_uuid?.sick_leave_points ?? 0,
                vacation_points: i?.employee_uuid?.vacation_leave_points ?? 0,
                filed_uuid: i?.uuid,
                date_filed: i?.date_filed,
                type_leave: i?.leave_name?.name,
                leave_start: i?.leave_start,
                leave_end: i?.leave_end,
                total_days: getTotalDays(convertCalendarDate(i?.leave_start), convertCalendarDate(i?.leave_end)),
                contact_number: i?.contact_number,
                reason: i?.reason,
                hr_name: i?.hr?.employee_name ?? '-',
                status: i?.status,
                processed_at: i?.processed_at
            }))
            }

    
        return { leaveHistory };
}) satisfies PageServerLoad;