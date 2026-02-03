import { redirect } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
    const code = url.searchParams.get('code')
    const next = url.searchParams.get('next') ?? '/input-id'

    console.log('Auth callback - Code received:', code ? 'Yes' : 'No');

    if (code) {
        const { data, error } = await supabase.auth.exchangeCodeForSession(code)
        
        if (!error && data.session) {
            console.log('Session created for:', data.session.user.email);
            throw redirect(303, next)
        }
        
        console.error('Auth callback error:', error)
    }

    throw redirect(303, '/login')
}