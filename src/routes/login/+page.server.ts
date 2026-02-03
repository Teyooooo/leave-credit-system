import type { Actions } from "@sveltejs/kit";
import { fail, redirect } from "@sveltejs/kit";

export const actions: Actions = {
    login: async ({ locals: { supabase }, url }) => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${url.origin}/auth/callback?next=/input-id`
            }
        });

        if (error) {
            console.error('OAuth error:', error);
            return fail(500, { 
                message: 'Failed to initiate OAuth login',
                error: error.message 
            });
        }

        if (data.url) {
            throw redirect(303, data.url);
        }

        return fail(500, { message: 'No redirect URL received' });
    }
};
