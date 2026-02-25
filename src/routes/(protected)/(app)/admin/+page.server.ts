import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({locals}) => {
    await locals.logActivity('Accessed Admin Dashboard')
    throw redirect(303, '/admin/dashboard');
};