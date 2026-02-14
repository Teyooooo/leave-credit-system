import { getJsonCookie } from "$lib/server/cookies";
import type { EmployeeData } from "$lib/types/data";
import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, cookies}) => {
    const { data: { session } } = await locals.supabase.auth.getSession();
    const employee = getJsonCookie<EmployeeData>(cookies, "employee_data")

    // Don't redirect if we're on the auth callback route
    if (!session) {
        throw redirect(303, '/login');
    }

    if (employee === null){
        throw redirect(303, '/auth/signout');
    }

    if (employee.role_in_system !== "Admin"){
        throw redirect(303, '/dashboard')
    }

    return {
        employee
    };
};