import { getJsonCookie, updateCookie } from "$lib/server/cookies";
import type { EmployeeData } from '$lib/types/data';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load = (async () => {
    return {};
}) satisfies PageServerLoad;

export const actions: Actions = {
    change_name: async ({ request, locals, cookies }) => {
        const formData = await request.formData()

        console.log({ formData })

        const name = formData.get("name") as string

        if (!name) {
            return fail(400, {
                error: true,
                message: "New name is required"
            })
        }

        if (name.length < 4) {
            return fail(400, {
                error: true,
                message: "Name must be at least 4 characters long"
            });
        }

        const cookie = getJsonCookie<EmployeeData>(cookies, "employee_data")
        console.log({ cookie })

        const { data: employee, error } = await locals.supabase
            .from('employees')
            .update({ employee_name: name })
            .eq('employee_id', Number(cookie?.employee_id))
            .select(`*, department_info: departments!department( name )`)
            .single()

        if (error) {
            console.error('DB update failed:', error);

            return fail(500, {
                error: true,
                message: 'Failed to update name. Please try again.'
            });
        }


        //update cookies if the change name is success
        const { data: { session } } = await locals.supabase.auth.getSession()

        if (!session) {
            throw redirect(303, "/login")
        }

        // Transform the database record to match EmployeeData structure
        const updatedEmployeeData: EmployeeData = {
            uuid: employee.uuid,
            profile_pic: employee.profile_pic_url,
            employee_id: employee.employee_id,
            name: employee.employee_name,
            email: employee.email,
            department_uuid: employee.department,
            department: employee.department_info?.name,
            position: employee.position,
            role_in_system: employee.role_in_system
        };

        updateCookie(cookies, "employee_data", updatedEmployeeData, session);

        await locals.logActivity(`Updated employee name to "${name}" (ID: ${cookie?.employee_id})`)

        return { success: true, employee: updatedEmployeeData };
    }
};