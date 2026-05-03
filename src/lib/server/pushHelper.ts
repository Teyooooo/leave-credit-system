// src/lib/server/pushHelper.ts
import webpush from 'web-push';
import { VAPID_PRIVATE_KEY, VAPID_EMAIL } from '$env/static/private';
import { PUBLIC_VAPID_KEY } from '$env/static/public';
import type { App } from '$lib/types'; 

webpush.setVapidDetails(VAPID_EMAIL, PUBLIC_VAPID_KEY, VAPID_PRIVATE_KEY);

export async function sendPushNotification(
  locals: App.Locals,
  user_uuid: string,
  title: string,
  body: string,
  url?: string
): Promise<boolean> {
  try {
    const { data: subscriptions, error } = await locals.supabase  // ← use locals.supabase
      .from('push_subscriptions')
      .select('endpoint, p256dh, auth')
      .eq('user_uuid', user_uuid);

    if (error || !subscriptions?.length) return false;

    const results = await Promise.allSettled(
      subscriptions.map((sub) =>
        webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          JSON.stringify({ title, body, url })
        )
      )
    );

    // Cleanup expired subscriptions
    const expiredEndpoints = results
      .map((result, i) => {
        if (result.status === 'rejected') {
          const err = result.reason as { statusCode?: number };
          if (err.statusCode === 410 || err.statusCode === 404) {
            return subscriptions[i].endpoint;
          }
        }
        return null;
      })
      .filter(Boolean) as string[];

    if (expiredEndpoints.length > 0) {
      await locals.supabase
        .from('push_subscriptions')
        .delete()
        .in('endpoint', expiredEndpoints);
    }

    return results.some((r) => r.status === 'fulfilled');
  } catch (err) {
    console.error('Error sending push notification:', err);
    return false;
  }
}