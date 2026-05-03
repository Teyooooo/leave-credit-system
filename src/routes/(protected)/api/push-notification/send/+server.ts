import webpush from 'web-push';
import { json } from '@sveltejs/kit';
import { VAPID_PRIVATE_KEY, VAPID_EMAIL } from '$env/static/private';
import { PUBLIC_VAPID_KEY } from '$env/static/public';
import type { RequestHandler } from './$types';

webpush.setVapidDetails(VAPID_EMAIL, PUBLIC_VAPID_KEY, VAPID_PRIVATE_KEY);

export const POST: RequestHandler = async ({ request, locals }) => {
  const { user_uuid, title, body, url } = await request.json();
  console.log({ user_uuid, title, body, url });

  // Fetch all subscriptions for this user
  const { data: subscriptions, error } = await locals.supabase
    .from('push_subscriptions')
    .select('endpoint, p256dh, auth')
    .eq('user_uuid', user_uuid);

  if (error) return json({ success: false, error: error.message }, { status: 500 });
  if (!subscriptions?.length) return json({ success: false, error: 'No subscriptions found for this user' }, { status: 404 });

  const results = await Promise.allSettled(
    subscriptions.map((sub) =>
      webpush.sendNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        JSON.stringify({ title, body, url })
      )
    )
  );

  // Cleanup expired subscriptions
  const expiredEndpoints: string[] = [];
  results.forEach((result, i) => {
    if (result.status === 'rejected') {
      const err = result.reason as { statusCode?: number };
      if (err.statusCode === 410 || err.statusCode === 404) {
        expiredEndpoints.push(subscriptions[i].endpoint);
      }
    }
  });

  if (expiredEndpoints.length > 0) {
    await locals.supabase
      .from('push_subscriptions')
      .delete()
      .in('endpoint', expiredEndpoints);
  }

  const sent = results.filter((r) => r.status === 'fulfilled').length;
  const failed = results.filter((r) => r.status === 'rejected').length;

  return json({ success: true, sent, failed, total: subscriptions.length });
};