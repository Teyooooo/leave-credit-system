import type { EmployeeDataAdmin } from '$lib/types/data';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load = (async () => {
    return{}
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
                role_in_system: 'Client'
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

        const {data, error } = await locals.supabase
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

        console.log({data})

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
    },
    update_role_employee : async ({request, locals}) => {
        const formData = await request.formData()
        const uuid = formData.get('uuid') as string
        const role_in_system = formData.get('role_in_system') as string

        console.log({
            uuid,
            role_in_system
        })

        const { data, error } = await locals.supabase
            .from('employees')
            .update({
                role_in_system
            })
            .eq('uuid', uuid)
            .select()
        

        if(error){
            return fail(500, {
                error: true,
                message: 'Failed to update system role. Please try again later.'
            })
        }

        console.log({data})

        return {success: true}
    }
};