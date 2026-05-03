import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
  const { userUuid } = await request.json();
  console.log('Unsubscribe request for user:', userUuid);

  const { error } = await locals.supabase
    .from('push_subscriptions')
    .delete()
    .eq('user_uuid', userUuid);

  if (error) {
    return json({ success: false, error: error.message }, { status: 500 });
  }

  return json({ success: true });
};