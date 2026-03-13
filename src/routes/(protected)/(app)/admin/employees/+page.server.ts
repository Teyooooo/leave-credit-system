import type { Department } from '$lib/types/data';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({locals}) => {
    
    let { data: departments, error } = await locals.supabase
    .from('departments')
    .select('*, head_info: employees!dept_head( employee_name )')

    let listOfDepartments: Department[] = []
    if(!error){
        console.log({departments})
        listOfDepartments = departments?.map(i => ({
            uuid: i?.uuid,
            name: i?.name,
            created_at: i?.created_at,
            head_uuid: i?.dept_head,
            head_name: i?.head_info?.employee_name
        })) || []
    }
          
    return{ listOfDepartments }
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

        await locals.logActivity(`Created employee "${name}" (ID: ${id})`)
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
            console.log('Failed to update employee info:', error)
            return fail(500, {
                error: true,
                message: 'Failed to update employee info. Please try again later.'
            })
        }

        await locals.logActivity(`Updated employee "${name}" (ID: ${id})`)
        return {success: true}
    },
    delete_employee : async ({request, locals}) => {
        const formData = await request.formData()
        const uuid = formData.get('uuid') as string
        const name = formData.get('employee_name') as string
        const id = formData.get('employee_id') as string

        const { error } = await locals.supabase
            .from('employees')
            .delete()
            .eq('uuid', uuid)

        if(error){

            const { error: errorUpdate } = await locals.supabase
            .from('employees')
            .update({
                is_account_active: false
            })
            .eq('uuid', uuid)

            if(errorUpdate){       
                return fail(500, {
                    error: true,
                    message: 'Failed to delete employee info. Please try again later.'
                })
            }
        }
        
        await locals.logActivity(`Deleting employee "${name}" (ID: ${id})`)
        return {success: true}
    },
    update_role_employee : async ({request, locals}) => {
        const formData = await request.formData()
        const uuid = formData.get('uuid') as string
        const role_in_system = formData.get('role_in_system') as string
        const name = formData.get('employee_name') as string
        const id = formData.get('employee_id') as string


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

        await locals.logActivity(`Updated system role of "${name}" to "${role_in_system}" (ID: ${id})`)
        return {success: true}
    }
};