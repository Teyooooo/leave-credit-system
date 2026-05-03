import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
	const { subscription, userUuid } = await request.json();
	const { endpoint, keys } = subscription;

    console.log({subscription, userUuid})

	const { error } = await locals.supabase.from('push_subscriptions').upsert(
		{
			endpoint,
			p256dh: keys.p256dh,
			auth: keys.auth,
			user_uuid: userUuid
		},
		{ onConflict: 'endpoint' } // update if endpoint already exists
	);

	if (error) {
		console.error('Supabase error:', error);
		return json({ success: false, error: error.message }, { status: 500 });
	}

	return json({ success: true });
};
