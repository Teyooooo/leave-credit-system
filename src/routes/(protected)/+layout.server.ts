import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
    const { data: { session } } = await locals.supabase.auth.getSession();

    // Don't redirect if we're on the auth callback route
    if (!session && !url.pathname.startsWith('/auth/callback')) {
        throw redirect(303, '/login');
    }

    return {
        email: session?.user?.email || null,
        user: session?.user || null
    };
};