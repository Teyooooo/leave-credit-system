import type { PageServerLoad } from './$types';

export const load = (async ({parent, locals}) => {
    const { employee } = await parent();

    const { error } = await locals.supabase
        .from('push_subscriptions')
        .select('*')
        .eq('user_uuid', employee.uuid)
        .single();
    
    if(error){
        console.error('Error fetching push subscription:', error);
        return { userIsSubscription: false };
    }

    return { userIsSubscription: true };
}) satisfies PageServerLoad;