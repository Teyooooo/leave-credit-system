import type { EmployeeDataAdmin } from '$lib/types/data';
import type { LayoutServerLoad } from './$types';

export const load = (async ({locals}) => {

        const { data, error} = await locals.supabase
            .from('employees')
            .select(`*, department_info: departments!department( name )`)
    
        if ( error ){
            return { employees: []}
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
    
    
        return { employees };

}) satisfies LayoutServerLoad;