import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { AnnouncementInfo } from '$lib/types/data';

export const load = (async ({locals}) => {
    const { data, error } = await locals.supabase
        .from('announcement')
        .select()
        .order('created_at', {ascending: false})

    if(error){
        return { errorMessage: 'Failed to fetch data to server.'}
    }   

    const announcements: AnnouncementInfo[] = data?.map((i)=>({
        created_at: i.created_at,
        title: i.title,
        details: i.details,
        valid_until_start: i.valid_until_start,
        valid_until_end: i.valid_until_end,
        type: 'all'
    }))

    return { announcements };
}) satisfies PageServerLoad;

export const actions: Actions = {
    add_announcement : async ({request, locals}) => {
        const formData = await request.formData()

        const title = formData.get('title')
        const details = formData.get('details')
        const valid_until_start = formData.get('valid_until_start')
        const valid_until_end = formData.get('valid_until_end')

        const { error } = await locals.supabase
            .from('announcement')
            .insert({
                title,
                details,
                valid_until_start,
                valid_until_end
            })

        if(error){
            console.log("Database Error:", error)
            return fail(500, {
                error: true,
                message: 'Failed to add new leave. Please try again.'
            })
        }

        return {success: true}
    }
};