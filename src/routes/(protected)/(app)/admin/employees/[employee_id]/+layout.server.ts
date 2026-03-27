import type { LayoutServerLoad } from './$types';

export const load = (async ({params, parent}) => {
    const { employee_id } = params
    const { employees } = await parent()
    const current_employee = employees.find(employee => 
        employee.employee_id === Number(employee_id)
        );

    return {
        params: employee_id,
        current_employee_info: current_employee,
    };
}) satisfies LayoutServerLoad;