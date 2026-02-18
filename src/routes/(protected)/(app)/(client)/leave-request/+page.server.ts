import type { LeaveData } from '$lib/types/data';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({locals}) => {
    // getting the list of leave types
    const { data, error } = await locals.supabase
        .from('types_of_leave')
        .select()

    if (error) {
        console.error("Database Error:", error)
        return { error }
    }

    const list_of_leave: LeaveData[] = data.map(item => ({
        uuid: item.uuid,
        name: item.name,
        entitlement: item.entitlement,
        description: item.description,
    }))

    return { list_of_leave };

}) satisfies PageServerLoad;

export const actions: Actions = {
    file_leave: async ({request, locals}) => {
        const formData = await request.formData()

        console.log({formData})
    }
};