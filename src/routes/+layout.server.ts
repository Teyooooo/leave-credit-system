import { loadFlash } from 'sveltekit-flash-message/server';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = loadFlash(async (event) => {
  const { locals: { safeGetSession }, cookies } = event;
  const { session, user } = await safeGetSession()

  return {
    session,
    user,
    cookies: cookies.getAll(),
  }
});