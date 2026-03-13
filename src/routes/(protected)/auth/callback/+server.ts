import { redirect } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
    const code = url.searchParams.get('code')
    const next = url.searchParams.get('next') ?? '/input-id'

    console.log('Auth callback - Code received:', code ? 'Yes' : 'No');

    if (code) {
        const { data, error } = await supabase.auth.exchangeCodeForSession(code)

        // Checking the is_account_active
        const { data: employee, error: employeeError } = await supabase
        .from("employees")
        .select(`*, department_info: departments!department(name)`)
        .eq('email', data?.session?.user.email)
        .single();

        if (employeeError || !employee) {
            await supabase.auth.signOut();
            throw redirect(303, "/login?error=account_not_found");
        }

        if(!employee?.is_account_active){
            await supabase.auth.signOut();
            throw redirect(303, "/login?error=account_deleted");
        }

        if (!error && data.session) {
            console.log('Session created for:', data.session.user.email);
            throw redirect(303, next)
        }
        
        console.error('Auth callback error:', error)
    }

    throw redirect(303, '/login')
}