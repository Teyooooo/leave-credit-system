import type { Session } from '@supabase/supabase-js';
import type { Cookies } from '@sveltejs/kit';

const isDev = process.env.NODE_ENV === 'development';


// Cookie tied to auth session (expires when Supabase session expires)
export function setAuthCookie(
    cookies: Cookies,
    name: string,
    value: any,
    session: Session
) {
    const expiresAt = session.expires_at;
    const now = Math.floor(Date.now() / 1000);
    const maxAge = expiresAt ? expiresAt - now : undefined;

    // Automatically JSON.stringify the value
    cookies.set(name, JSON.stringify(value), {
        path: '/',
        httpOnly: true,
        secure: !isDev,
        sameSite: 'lax',
        maxAge
    });
}

// Get JSON cookie with type safety
export function getJsonCookie<T>(cookies: Cookies, name: string): T | null {
    const value = cookies.get(name);
    if (!value) return null;

    try {
        return JSON.parse(value) as T;
    } catch {
        return null;
    }
}

// Delete a single cookie
export function deleteCookie(cookies: Cookies, name: string) {
    cookies.delete(name, { path: '/' });
}

// Clear multiple cookies at once
export function clearCookies(cookies: Cookies, names: string[]) {
    names.forEach(name => deleteCookie(cookies, name));
}

export function updateCookie(
    cookies: Cookies, 
    name: string,
    value: any,
    session: Session) {

    setAuthCookie(cookies, name, value, session)

}