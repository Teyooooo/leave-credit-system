import type { AdminFiledLeaveInfo } from '$lib/types/data';
import { leaveDeclinedTemplate, sendLeaveEmail } from '$lib/utils/emailHelper';
import { convertCalendarDate, currentTimestamp, getTotalDays } from '$lib/utils/helper';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { PostgrestError } from '@supabase/supabase-js';
import { sendPushNotification } from '$lib/server/pushHelper';
import { applyLanes } from 'layerchart';

export const load = (async ({ locals, parent }) => {
	const { employee } = await parent();
	let pendingLeave: AdminFiledLeaveInfo[] = [];
	let filedLeave: any[] | null = null;
	let filedLeaveError: PostgrestError | null = null;
	let listOfEmployeeUuids: string[] = [];

	console.log({ employee });

	if (employee.position === 'Campus Director') {
        console.log('Campus Director loading pending requests...');
		// for CD get all employees in the system except other CD
		let { data: employees, error: employeesError } = await locals.supabase
			.from('employees')
			.select('uuid')
            .eq('is_account_active', true)
			.neq('uuid', employee.uuid);

		if (!employeesError) {
			console.log({ employees }, employees?.length);
			listOfEmployeeUuids = employees?.map((i) => i?.uuid) || [];
		}

        console.log({ listOfEmployeeUuids });

		// sunod kay kuhaon if naay pending mga gipang file nga leave
		let { data, error } = await locals.supabase
			.from('filed_leave')
			.select(
				`*, 
                hr: employees!hr_uuid( employee_name ), 
                leave_name: types_of_leave!type_of_leave( name ),
                employee_info: employees!employee_uuid( employee_name, position, employee_id, email, profile_pic_url, uuid, 
                    department_info: departments!department( name )
                )`
			)
			.in('employee_uuid', listOfEmployeeUuids)
			.eq('status', 'Pending')
			.eq('approve_by_dept_head', true)
			.eq('approve_by_CD', false)
			.order('date_filed', { ascending: false });

        console.log('Filed Leave for CD:', { data, error });

		filedLeave = data;
		filedLeaveError = error;
	} else if (employee.position === 'Department Head') {
        console.log('Department Head loading pending requests...');
		// getting the list of pending request in the same department
		// unahon og kuha ang mga list of employees sa department
		let { data: employees, error: employeesError } = await locals.supabase
			.from('employees')
			.select('uuid')
            .eq('is_account_active', true)
			.eq('department', employee.department_uuid);

		if (!employeesError) {
			console.log({ employees });
			listOfEmployeeUuids = employees?.map((i) => i?.uuid) || [];
		}

		// sunod kay kuhaon if naay pending mga gipang file nga leave
		let { data, error } = await locals.supabase
			.from('filed_leave')
			.select(
				`*, 
                hr: employees!hr_uuid( employee_name ), 
                leave_name: types_of_leave!type_of_leave( name ),
                employee_info: employees!employee_uuid( employee_name, position, employee_id, email, profile_pic_url, uuid, 
                    department_info: departments!department( name )
                )`
			)
			.in('employee_uuid', listOfEmployeeUuids)
			.eq('status', 'Pending')
			.eq('approve_by_dept_head', false)
			.order('date_filed', { ascending: false });

		filedLeave = data;
		filedLeaveError = error;
	}

	if (!filedLeaveError && filedLeave) {
		// Get all unique employee UUIDs
		const employeeUuids = [...new Set(filedLeave.map((i) => i.employee_uuid))];

		// Single query instead of one per employee
		const { data: creditData } = await locals.supabase
			.from('credit_points')
			.select('id, employee_uuid, vacation_leave_points, sick_leave_points')
			.in('employee_uuid', employeeUuids);

		console.log('Credit Data:', { creditData });

		const creditMap = new Map(creditData?.map((c) => [c.employee_uuid, c]) ?? []);

		for (const i of filedLeave) {
			const credit = creditMap.get(i.employee_uuid);

			console.log({ i, credit });

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
				total_days: getTotalDays(
					convertCalendarDate(i?.leave_start),
					convertCalendarDate(i?.leave_end)
				),
				contact_number: i?.contact_number,
				reason: i?.reason,
				hr_name: i?.hr?.employee_name ?? '-'
			});
		}
	}

	return { pendingLeave };
}) satisfies PageServerLoad;

export const actions: Actions = {
	approve_filed: async ({ request, locals }) => {
		const formData = await request.formData();
		console.log('Approve:', { formData });

		const uuid = formData.get('uuid') as string;
		const applicant_name = formData.get('applicant_name') as string;
		const applicant_id = formData.get('applicant_id') as string;
		const reviewee_position = formData.get('reviewee_position') as string;
		const applicant_uuid = formData.get('applicant_uuid') as string;
		
		
		const { error } = await locals.supabase
		.from('filed_leave')
		.update(
			reviewee_position === 'Department Head' ? { approve_by_dept_head: true } : { approve_by_CD: true },
		)
		.eq('uuid', uuid);
		
		if (error) {
			return fail(500, {
				error: true,
				message: `Failed to approve request by the ${reviewee_position}. Try again later.`
			});
		}

		await sendPushNotification( locals, applicant_uuid, 'Leave Application Update', `Your leave application has been approved by the ${reviewee_position}.`);
		
		await locals.logActivity(
			`Approved leave application for ${applicant_name} (ID: ${applicant_id}) as a ${reviewee_position}`
		);

		return { success: true };
	},
	decline_filed: async ({ request, locals }) => {
		const formData = await request.formData();
		console.log('Decline:', { formData });

		const uuid = formData.get('uuid') as string;
		const applicant_name = formData.get('applicant_name') as string;
		const applicant_id = formData.get('applicant_id') as string;
		const applicant_email = formData.get('applicant_email') as string;
		const reviewee_uuid = formData.get('reviewee_uuid') as string;
		const reviewee_name = formData.get('reviewee_name') as string;
		const reviewee_position = formData.get('reviewee_position') as string;
		const type_leave = formData.get('type_leave') as string;
		const start_date = formData.get('start_date') as string;
		const end_date = formData.get('end_date') as string;
		const total_days = formData.get('total_days') as string;
		const reason = formData.get('reason') as string;

		const { error } = await locals.supabase
			.from('filed_leave')
			.update({
				status: 'Decline',
				processed_at: currentTimestamp(),
				decline_reason: reason
			})
			.eq('uuid', uuid);

		if (error) {
			return fail(500, {
				error: true,
				message: `Failed to decline request by the ${reviewee_position}. Try again later.`
			});
		}

		await locals.logActivity(
			`Declined leave application for ${applicant_name} (ID: ${applicant_id}) as a ${reviewee_position}`
		);

		await sendLeaveEmail(
			'declined',
			applicant_email,
			leaveDeclinedTemplate(
				applicant_name,
				type_leave,
				start_date,
				end_date,
				Number(total_days),
				reviewee_name,
				reason,
				reviewee_position
			)
		);

		return { success: true };
	}
};
