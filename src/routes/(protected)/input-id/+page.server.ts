import { getJsonCookie, setAuthCookie } from "$lib/server/cookies";
import type { EmployeeData } from "$lib/types/data";
import { fail, redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";



export const load: PageServerLoad = async ({ locals, cookies }) => {
    const { data: { session } } = await locals.supabase.auth.getSession();

    if (!session) {
        throw redirect(303, "/login")
    }

    const email = session.user.email;  // ✅ Secure!
    const profilePic = session.user.user_metadata.avatar_url;


    const { data: employee , error } = await locals.supabase
        .from("employees")
        .select('*')
        .eq('email', email)  // ✅ Using server-side email
        .single();

    if (error) {
        console.error('Database error:', error);
    }

    console.log({ employee })

    if (employee.is_account_verified) {
        const cookie = getJsonCookie<EmployeeData>(cookies, "employee_data")

        if(cookie === null){
            setAuthCookie(cookies, "employee_data",{
                profilePic,
                employee_id: employee.employee_id,
                name: employee.employee_name,
                email: employee.email,
                department_id: employee.department_id,
                position: employee.position,
                employment_status: employee.employment_status,
                role_in_system: employee.role_in_system
            } ,session)
        }
        throw redirect(303, "/dashboard")
    }
};


export const actions: Actions = {
    verifyID: async ({ request, locals, cookies }) => {
        // Get email from session (secure - can't be tampered with)
        const { data: { session } } = await locals.supabase.auth.getSession();

        if (!session) {
            return fail(401, { error: 'Not authenticated' });
        }

        const email = session.user.email; 
        const profilePic = session.user.user_metadata.avatar_url;

        const formData = await request.formData();
        const employeeID = formData.get("employeeID");

        if (!employeeID) {
            return fail(400, { error: 'Employee ID is required' });
        }

        console.log('Verifying employee:', employeeID, 'for user:', email);

        const { data, error } = await locals.supabase
            .from("employees")
            .select('*')
            .eq('employee_id', Number(employeeID))
            .eq('email', email)  // ✅ Using server-side email
            .single();

        if (error) {
            console.error('Database error:', error);
            return fail(404, {
                error: 'Employee not found or does not match your account'
            });
        }


        console.log({ data })

        if (!data.is_account_verified) {
            const { data: employee , error } = await locals.supabase
                .from('employees')
                .update({ is_account_verified: true })
                .eq('employee_id', Number(employeeID))
                .select()
                .single()


            if (error) {
                console.error('Database error:', error);
                return fail(404, {
                    error: 'There\'s a problem in verifying you right now. Try again later.'
                });
            }

            console.log("Updated data:", employee)

            setAuthCookie(cookies, "employee_data",{
                profilePic,
                employee_id: employee.employee_id,
                name: employee.employee_name,
                email: employee.email,
                department_id: employee.department_id,
                position: employee.position,
                employment_status: employee.employment_status,
                role_in_system: employee.role_in_system
            } ,session)

            throw redirect(303, "/dashboard")
        }

        return { success: true, employee: data };
    }
};