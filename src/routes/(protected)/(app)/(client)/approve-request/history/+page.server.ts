import type { LeaveHistory } from '$lib/types/data';
import { convertCalendarDate, getTotalDays } from '$lib/utils/helper';
import type { PageServerLoad } from './$types';

export const load = (async ({locals, parent}) => {
    const { employee } = await parent()

    console.log({ employee })

    // getting the list of pending request in the same department
    // unahon og kuha ang mga list of employees sa department
    let { data: employees, error: employeesError } = await locals.supabase
        .from('employees')
        .select('uuid')
        .eq('department', employee.department_uuid)

    let listOfEmployeeUuids: string[] = []
    if (!employeesError) {
        console.log({ employees })
        listOfEmployeeUuids = employees?.map(i => (i?.uuid)) || []
    }

    const { data, error } = await locals.supabase
            .from('filed_leave')
            .select(`*, 
                hr: employees!hr_uuid( employee_name ), 
                leave_name: types_of_leave!type_of_leave( name ),
                employee_info: employees!employee_uuid( employee_name, position, employee_id, email, profile_pic_url, uuid,
                    department_info: departments!department( name )
                )`
            )
            .in('employee_uuid', listOfEmployeeUuids)
            .in('status', ['Approve', 'Decline'])
            .order('date_filed', { ascending: false })
    
        
        let leaveHistory: LeaveHistory[] = []
          if(!error){
            console.log({data})

            leaveHistory = data?.map( i => ({
                employee_uuid: i?.employee_info?.uuid,
                employee_name: i?.employee_info?.employee_name,
                employee_id: i?.employee_info?.employee_id,
                employee_email: i?.employee_info?.email,
                employee_department: i?.employee_info?.department_info?.name,
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
                processed_at: i?.processed_at,
                decline_reason: i?.decline_reason,
                leave_points_snapshot: i?.leave_points_snapshot,
                dept_head_name: employee.name
            }))
            }

    
        return { leaveHistory };
}) satisfies PageServerLoad;