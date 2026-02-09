import type { LeaveData } from '$lib/types/data';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({locals}) => {

    const { data, error } = await locals.supabase
        .from('types_of_leave')
        .select()

    
    if(error){
        console.log('Database Error:', error)
        return fail(500, {
            error: false,
            message: 'Failed to fetch data to server.'
        })
    }

    const list_of_leave: LeaveData[] = data.map((item)=>({
        uuid: item.uuid as string,
        name: item.name as string,
        entitlement: item.entitlement as string,
        description: item.description as string
    }))

    return { list_of_leave };
}) satisfies PageServerLoad;