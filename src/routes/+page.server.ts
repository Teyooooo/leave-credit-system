import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";


export const load: PageServerLoad = async ({ url, locals }) => {
    // Optional: redirect if already logged in
    const { data: { session } } = await locals.supabase.auth.getSession();
    
    if (session) {
        // 
        throw redirect(303, '/dashboard'); // or wherever logged-in users should go
    }else{
        // no user login
        throw redirect(303, '/login'); 

    }
    
    return {};
};