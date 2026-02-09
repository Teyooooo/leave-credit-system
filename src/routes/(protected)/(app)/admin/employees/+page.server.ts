import type { EmployeeDataAdmin } from '$lib/types/data';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({locals}) => {
    const { data, error} = await locals.supabase
        .from('employees')
        .select()

    if ( error ){
        return { error: true, message: "Failed to fetch employees."}
    }

    const employees: EmployeeDataAdmin[] = data.map( item => ({
        uuid: item.uuid as string || "",
        profile_pic: item.profile_pic_url as string || "",
        employee_id: item.employee_id as number,
        name: item.employee_name as string,
        email: item.email as string,
        department: item.department as string,
        position: item.position as string,
        created_at: item.created_at as string,
        is_account_verified: item.is_account_verified as boolean,
        }))


    return { employees };
}) satisfies PageServerLoad;

export const actions: Actions = {
    add_employee : async ({request, locals}) => {
        const formData = await request.formData()

        const name = formData.get('name') as string
        const email = formData.get('email') as string
        const id = Number(formData.get('id') as string)
        const position = formData.get('position') as string
        const department = formData.get('department') as string

        const { error } = await locals.supabase
            .from('employees')
            .insert({
                employee_id: id,
                employee_name: name,
                email,
                department,
                position,
                is_account_verified: false,
            })

        if ( error ){
            return fail(500, {error: true, message: 'Failed to add new employee. Please try again.'})
        }

        return {success: true}
    },
    edit_employee : async ({request, locals}) => {
        const formData = await request.formData()

        const uuid = formData.get('uuid') as string
        const name = formData.get('name') as string
        const email = formData.get('email') as string
        const id = Number(formData.get('id') as string)
        const position = formData.get('position') as string
        const department = formData.get('department') as string

        const { error } = await locals.supabase
            .from('employees')
            .update({
                employee_id: id,
                employee_name: name,
                email,
                department,
                position,
            })
            .eq('uuid', uuid)

        if(error){
            return fail(500, {
                error: true,
                message: 'Failed to update employee info. Please try again later.'
            })
        }

        return {success: true}
    },
    delete_employee : async ({request, locals}) => {
        const formData = await request.formData()
        const uuid = formData.get('uuid') as string

        console.log({uuid})

        const { error } = await locals.supabase
            .from('employees')
            .delete()
            .eq('uuid', uuid)

        if(error){
            return fail(500, {
                error: true,
                message: 'Failed to delete employee info. Please try again later.'
            })
        }

        return {success: true}
    }
};