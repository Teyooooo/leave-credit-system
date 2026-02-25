import type { Department, UserIcon } from '$lib/types/data';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({locals}) => {

    const [
        { data: departments, error: departmentsError },
        { data: employees, error: employeesError }
    ] = await Promise.all([
        locals.supabase
            .from('departments')
            .select('*, head_info: employees!dept_head( employee_name )'),
        locals.supabase
            .from('employees')
            .select('*'),
    ])

    let listOfDepartments: Department[] = [] 
    if(!departmentsError){
        console.log({departments})
        listOfDepartments = departments?.map(i => ({
            uuid: i?.uuid,
            name: i?.name,
            created_at: i?.created_at,
            head_uuid: i?.dept_head ?? '',
            head_name: i?.head_info?.employee_name ?? 'Not Assigned'
        })) || []
    }

    let listOfEmployees: UserIcon[] = [] 
    if(!employeesError){
        console.log({employees})
        listOfEmployees = employees?.map(i => ({
            uuid: i?.uuid,
            name: i?.employee_name,
            employee_id: i?.employee_id,
           profile_pic: i?.profile_pic_url     
        })) || []
    }
          
    return {
        listOfDepartments,
        listOfEmployees
    };
}) satisfies PageServerLoad;

export const actions: Actions = {
    add_department: async ({ request, locals }) => {
        const formData = await request.formData()

        const deptName = formData.get('name')
        const deptHead = formData.get('dept_head')
        const cleanDeptHead = deptHead === '' || deptHead === null ? null : String(deptHead)

        const { data: department, error: departmentError } = await locals.supabase
            .from('departments')
            .insert({
                name: deptName,
                dept_head: cleanDeptHead
            })
            .select()
            .single()

        if(departmentError){
            console.log('Failed to creating department:', departmentError)
            return fail(500, {
                error: true,
                message: 'Failed to creating department. Try again later.'
            })
        }

        if(cleanDeptHead){
            const { error } = await locals.supabase
                .from('employees')
                .update({
                    department: department.uuid,
                    position: 'Department Head'
                })
                .eq('uuid', deptHead)
            
            if(error){
                console.log('Failed to update dept head info:', error)
                return fail(500, {
                    error: true,
                    message: 'Failed to Department Head Info. Try again later.'
                })
            }
        }

        await locals.logActivity(`Created Department "${deptName}"`)

        return { success: true }
    },
    update_department: async ({ request, locals }) => {
        const formData = await request.formData()

        const deptUuid = formData.get('uuid')
        const deptName = formData.get('name')
        const newDeptHead = formData.get('new_dept_head')
        const oldDeptHead = formData.get('old_dept_head')

        const { error } = await locals.supabase
            .from('departments')
            .update({
                name: deptName,
                dept_head: newDeptHead
            })
            .eq('uuid', deptUuid)

        if(error){
            console.log('Failed to updating department:', error)
            return fail(500, {
                error: true,
                message: 'Failed to updating department. Try again later.'
            })
        }

        // Updating the Employees Info
        // I implement this say kay naa times nga unassigned ang department head in the first making
        if( newDeptHead ){
            const { error } = await locals.supabase
                .from('employees')
                .update({
                    department: deptUuid,
                    position: 'Department Head'
                })
                .eq('uuid', newDeptHead)
            
            if(error){
                console.log('Failed to updating new dept head info:', error)
                return fail(500, {
                    error: true,
                    message: 'Failed to updating new department head info. Try again later.'
                })
            }
        }

        if(oldDeptHead){
            const { error } = await locals.supabase
                .from('employees')
                .update({
                    department: deptUuid,
                    position: '-'
                })
                .eq('uuid', oldDeptHead)

            if(error){
                console.log('Failed to updating old dept head info:', error)
                return fail(500, {
                    error: true,
                    message: 'Failed to updating old department head info. Try again later.'
                })
            }
        }

        await locals.logActivity(`Updated Department "${deptName}"`)

        return { success: true }
    },
    delete_department: async ({ request, locals }) => {
        const formData = await request.formData()

        const deptUuid = formData.get('uuid')
        const deptName = formData.get('name')

        const { error: updateDeptEmployeeError } = await locals.supabase
            .from('employees')
            .update({ department: null, position: '-' })
            .eq('department', deptUuid)

        if(updateDeptEmployeeError){
            console.log('Failed to updating employees department:', updateDeptEmployeeError)
            return fail(500, {
                error: true,
                message: 'Failed to updating employees department. Try again later.'
            })
        }


        const { error } = await locals.supabase
            .from('departments')
            .delete()
            .eq('uuid', deptUuid)

        if(error){
            console.log('Failed to deleting department:', error)
            return fail(500, {
                error: true,
                message: 'Failed to deleting department. Try again later.'
            })
        }

        await locals.logActivity(`Deleted Department "${deptName}"`)

        return { success: true }
    },
};