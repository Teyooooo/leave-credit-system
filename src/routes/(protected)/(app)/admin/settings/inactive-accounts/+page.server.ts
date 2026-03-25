import type { Department, EmployeeDataAdmin } from '$lib/types/data';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
    const [
        { data: employees, error: employeesError },
        { data: departments, error: departmentsError }
    ] = await Promise.all([
        locals.supabase
            .from('employees')
            .select(`*, department_info: departments!department( name )`),
        locals.supabase
            .from('departments')
            .select('*, head_info: employees!dept_head( employee_name )')
    ])

    let inactiveEmployees: EmployeeDataAdmin[] = []
    if (!employeesError) {
        const inactiveAccounts = employees.filter(i => !i.is_account_active)

        inactiveEmployees = inactiveAccounts.map(item => ({
            uuid: item.uuid as string || "",
            profile_pic: item.profile_pic_url as string || "",
            employee_id: item.employee_id as number,
            name: item.employee_name as string,
            email: item.email as string,
            department_uuid: item.department,
            department: item.department_info?.name as string ?? "-",
            position: item.position as string ?? "-",
            created_at: item.created_at as string,
            is_account_verified: item.is_account_verified as boolean,
            role_in_system: item.role_in_system as string,
        }))
    }

    let listOfDepartments: Department[] = []
    if (!departmentsError) {
        console.log({ departments })
        listOfDepartments = departments?.map(i => ({
            uuid: i?.uuid,
            name: i?.name,
            created_at: i?.created_at,
            head_uuid: i?.dept_head,
            head_name: i?.head_info?.employee_name
        })) || []
    }


    return { inactiveEmployees, listOfDepartments };
}) satisfies PageServerLoad;

export const actions: Actions = {
    re_active : async ({locals, request})=> {
        const formData = await request.formData()

        const { error } = await locals.supabase
        .from('employees')
        .update({ is_account_active: true })
        .eq('uuid', formData.get('uuid') as string)

        if(error){
            console.log("Database Error:", error)
            return fail(500, {
                error: true,
                message: 'Failed to reactive account. Please try again.'
            })
        }

        await locals.logActivity(`Reactivate Account: ${formData.get('name')} (ID: ${formData.get('id')})`)

        return {success: true}
    }
};