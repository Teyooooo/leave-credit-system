import type { AdminFiledLeaveInfo } from '$lib/types/data';
import { leaveApprovedTemplate, leaveDeclinedTemplate, sendLeaveEmail } from '$lib/utils/emailHelper';
import { convertCalendarDate, currentTimestamp, getTotalDays } from '$lib/utils/helper';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { sendPushNotification } from '$lib/server/pushHelper';

export const load = (async ({locals}) => {

    const { data: pending, error: pendingError } = await locals.supabase
        .from('filed_leave')
        .select(`*, 
            hr: employees!hr_uuid( employee_name ), 
            leave_name: types_of_leave!type_of_leave( name ),
            employee_info: employees!employee_uuid( employee_name, position, employee_id, email, profile_pic_url, uuid,
                department_info: departments!department( name )
            )`
        )
        .eq('status', 'Pending')
        .eq('approve_by_dept_head', true)
        .eq('approve_by_CD', true)
        .order('date_filed', { ascending: false })

    
    let pendingLeave: AdminFiledLeaveInfo[] = []
      if(!pendingError){

        // Get all unique employee UUIDs
        const employeeUuids = [...new Set(pending.map(i => i.employee_uuid))];

        // Single query instead of one per employee
        const { data: creditData } = await locals.supabase
            .from('credit_points')
            .select('id, employee_uuid, vacation_leave_points, sick_leave_points')
            .in('employee_uuid', employeeUuids);

        const creditMap = new Map(creditData?.map(c => [c.employee_uuid, c]) ?? []);

        for(const i of pending){

            const credit = creditMap.get(i.employee_uuid);

            console.log({i, credit})

            pendingLeave.push({
                employee_uuid: i?.employee_info?.uuid,
                employee_name: i?.employee_info?.employee_name,
                employee_id: i?.employee_info?.employee_id,
                employee_email: i?.employee_info?.email,
                employee_department: i?.employee_info?.department_info?.name,
                employee_position: i?.employee_info?.position,
                profile_pic_url: i?.employee_info?.profile_pic_url,
                employee_points_id: credit?.id ?? 0,
                sick_points: credit?.sick_leave_points ?? 0,
                vacation_points: credit?.vacation_leave_points ?? 0,
                filed_uuid: i?.uuid,
                date_filed: i?.date_filed,
                type_leave: i?.leave_name?.name,
                leave_start: i?.leave_start,
                leave_end: i?.leave_end,
                total_days: getTotalDays(convertCalendarDate(i?.leave_start), convertCalendarDate(i?.leave_end)),
                contact_number: i?.contact_number,
                reason: i?.reason,
                hr_name: i?.hr?.employee_name ?? '-'
            })
        }

      }  

    return { pendingLeave };
}) satisfies PageServerLoad;

export const actions: Actions = {
    approve_filed: async ({request, locals}) => {
        const formData = await request.formData()
        console.log('Approve:', {formData})

        const uuid = formData.get('uuid') as string
        const applicant_name = formData.get('applicant_name') as string
        const applicant_id = formData.get('applicant_id') as string
        const applicant_uuid = formData.get('applicant_uuid') as string
        const applicant_email = formData.get('applicant_email') as string
        const hr_uuid = formData.get('hr_uuid') as string
        const hr_name = formData.get('hr_name') as string
        const type_leave = formData.get('type_leave') as string
        const start_date = formData.get('start_date') as string
        const end_date = formData.get('end_date') as string
        const total_days = formData.get('total_days') as string
        const sick_leave_points = formData.get('sick_leave_points') as string
        const vacation_leave_points = formData.get('vacation_leave_points') as string

        // check is the leave is sick or vacation
        const where_to_update = type_leave === 'Sick Leave' ? 'sick_leave_points'
            : type_leave === 'Vacation Leave' ? 'vacation_leave_points'
            : 'others'

        const snapshot_points = type_leave === 'Sick Leave' ? `SLP: ${sick_leave_points} `
                              : type_leave === 'Vacation Leave' ? `VLP: ${vacation_leave_points}`
                              : null
        
        
        const { error } = await locals.supabase
            .from('filed_leave')
            .update({
                status: 'Approve',
                hr_uuid: hr_uuid,
                processed_at: currentTimestamp(),
                leave_points_snapshot: snapshot_points
            })
            .eq('uuid', uuid)

        if(error){
            return fail(500, {
                error: true,
                message: 'Failed to approve request. Try again later.'
            })
        }

        const updated_points = type_leave === 'Sick Leave' ? Number(sick_leave_points) - Number(total_days)
                              : type_leave === 'Vacation Leave' ? Number(vacation_leave_points) - Number(total_days)
                              : 0

        const { error: creditPointsError} = await locals.supabase
        .from('credit_points')
        .update({ [where_to_update]:  updated_points})
        .eq('employee_uuid', applicant_uuid)

        if(creditPointsError){
            return fail(500, {
                error: true,
                message: 'Failed to update points. Try again later.'
            })
        }
          

        await locals.logActivity(`Approved leave application for ${applicant_name} (ID: ${applicant_id}) as a HR`)

        await sendPushNotification(locals, applicant_uuid, 'Leave Application Update', `Your leave application has been approved by the HR.`);

        await sendLeaveEmail('approved', applicant_email, leaveApprovedTemplate(applicant_name, type_leave, start_date, end_date, Number(total_days), hr_name))

        return { success: true }

    },
    decline_filed: async ({request, locals}) => {
        const formData = await request.formData()
        console.log('Decline:', {formData})

        const uuid = formData.get('uuid') as string
        const applicant_name = formData.get('applicant_name') as string
        const applicant_id = formData.get('applicant_id') as string
        const applicant_uuid = formData.get('applicant_uuid') as string
        const applicant_email = formData.get('applicant_email') as string
        const hr_uuid = formData.get('hr_uuid') as string
        const hr_name = formData.get('hr_name') as string
        const type_leave = formData.get('type_leave') as string
        const start_date = formData.get('start_date') as string
        const end_date = formData.get('end_date') as string
        const total_days = formData.get('total_days') as string
        const reason = formData.get('reason') as string

        const { error } = await locals.supabase
            .from('filed_leave')
            .update({
                status: 'Decline',
                hr_uuid: hr_uuid,
                processed_at: currentTimestamp(),
                decline_reason: reason
            })
            .eq('uuid', uuid)

        if(error){
            return fail(500, {
                error: true,
                message: 'Failed to decline request. Try again later.'
            })
        }

        await locals.logActivity(`Declined leave application for ${applicant_name} (ID: ${applicant_id}) as a HR`)

        await sendPushNotification(locals, applicant_uuid, 'Leave Application Update', `Your leave application has been declined by the HR.`);

        await sendLeaveEmail('declined', applicant_email, leaveDeclinedTemplate(applicant_name, type_leave, start_date, end_date, Number(total_days), hr_name, reason,'HR'))

        return { success: true }
    }
};