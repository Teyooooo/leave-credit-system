import { clearCookies } from "$lib/server/cookies";
import { json, redirect } from "@sveltejs/kit";
import type { RequestHandler } from './$types';

const handler: RequestHandler = async ({ locals, cookies }) => {
    console.log("user logging out");

    const { error } = await locals.supabase.auth.signOut();
    
    if (error) {
        console.error('Sign out error:', error);
        return json(
            { message: "Failed to sign out" },
            { status: 400 }
        )
    }
    clearCookies(cookies, ["employee_data"])
    
    throw redirect(303, '/login');
};

export const GET = handler;
export const POST = handler;
