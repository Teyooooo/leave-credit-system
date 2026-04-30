import type { EmployeeDataAdmin } from '$lib/types/data';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({locals}) => {

    const { data, error} = await locals.supabase
        .from('employees')
        .select(`*, department_info: departments!department( name )`)

    if ( error ){
        return { employees: [], campusDirector: null}
    }

    const activeAccounts = data.filter( i => i.is_account_active)

    const employees: EmployeeDataAdmin[] = activeAccounts.map( item => ({
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

    const campusDirector = employees.find(i => i.position === 'Campus Director')

    console.log(employees, campusDirector)

    return { employees, campusDirector };
}) satisfies PageServerLoad;


export const actions: Actions = {
    update_campus_director : async ({locals, request}) => {
        const formData = await request.formData()
        const name = formData.get('name')
        const id = formData.get('id')
        const uuid = formData.get('uuid')
        const current_campus_director_uuid = formData.get('current_campus_director_uuid')

        const { error: changePreviousDirectorPositionError } = await locals.supabase
            .from('employees')
            .update({ position: null })
            .eq('uuid', current_campus_director_uuid)

        if( changePreviousDirectorPositionError ){
            console.log('Failed to updating previous Campus Director:', changePreviousDirectorPositionError)
            return fail(500, {
                error: true,
                message: 'Failed to updating previous Campus Director. Try again later.'
            })
        }

        const { error } = await locals.supabase
            .from('employees')
            .update({
                department : null,
                position: 'Campus Director'
            })
            .eq('uuid', uuid)

        if( error ){
            console.log('Failed to updating Campus Director:', error)
            return fail(500, {
                error: true,
                message: 'Failed to updating Campus Director. Try again later.'
            })
        }

        await locals.logActivity(`Update Campus Director "${name}" (ID: ${id})`)

        return { success: true }

    },
};