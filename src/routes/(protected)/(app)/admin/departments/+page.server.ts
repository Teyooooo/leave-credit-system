import type { Department } from '$lib/types/data';
import type { PageServerLoad } from './$types';

export const load = (async ({locals}) => {

    
    let { data: departments, error: departmentsError } = await locals.supabase
    .from('departments')
    .select('*, head_info: employees!dept_head( employee_name )')
    
    let listOfDepartments: Department[] = [] 
    if(!departmentsError){
        console.log({departments})
        listOfDepartments = departments?.map(i => ({
            uuid: i?.uuid,
            name: i?.name,
            created_at: i?.created_at,
            head_uuid: i?.dept_head,
            head_name: i?.head_info?.employee_name
        })) || []
    }


    let { data: employees, error } = await locals.supabase
    .from('employees')
    .select('*')
          

    return {
        listOfDepartments
    };
}) satisfies PageServerLoad;