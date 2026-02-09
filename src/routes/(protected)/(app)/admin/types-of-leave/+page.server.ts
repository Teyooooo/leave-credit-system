import type { LeaveData } from '$lib/types/data';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
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

    return { data: list_of_leave };
}) satisfies PageServerLoad;

export const actions: Actions = {
    add_leave: async ({ request, locals }) => {
        const formData = await request.formData()
        const name = formData.get('name') as string
        const entitlement = formData.get('entitlement') as string
        const description = formData.get('description') as string

        console.log({ name, entitlement, description })


        const { error: errorInsert } = await locals.supabase
            .from('types_of_leave')
            .insert({
                name,
                entitlement,
                description
            })

        if (errorInsert) {
            console.log("Database Error:", errorInsert)
            return fail(500, {
                error: true,
                message: 'Failed to add new leave. Please try again.'
            })
        }

        const { data, error: errorFetch } = await locals.supabase
            .from('types_of_leave')
            .select()

        console.log({ data })

        if (errorFetch) {
            console.error("Database Error:", errorFetch)
            return fail(500, {
                error: true,
                message: 'Failed to fetching leave. Please try again later.'
            })
        }

        const list_of_leave: LeaveData[] = data.map(item => ({
            uuid: item.uuid,
            name: item.name,
            entitlement: item.entitlement,
            description: item.description,
        }))

        return { success: true, data: list_of_leave }
    },
    edit_leave: async ({ request, locals }) => {
        const formData = await request.formData()

        console.log("Updating:")
        console.log({ formData })

        const { error: errorUpdate } = await locals.supabase
            .from('types_of_leave')
            .update({
                name: formData.get('name'),
                entitlement: formData.get('entitlement'),
                description: formData.get('description')
            })
            .eq('uuid', formData.get('uuid'))


        if (errorUpdate) {
            console.error("Database Error:", errorUpdate)
            return fail(500, {
                error: true,
                message: 'Failed to update leave. Please try again later.'
            })
        }

        const { data, error: errorFetch } = await locals.supabase
            .from('types_of_leave')
            .select()

        console.log({ data })

        if (errorFetch) {
            console.error("Database Error:", errorFetch)
            return fail(500, {
                error: true,
                message: 'Failed to fetching leave. Please try again later.'
            })
        }

        const list_of_leave: LeaveData[] = data.map(item => ({
            uuid: item.uuid,
            name: item.name,
            entitlement: item.entitlement,
            description: item.description,
        }))

        return { success: true, data: list_of_leave };
    },
    delete_leave: async ({ request, locals }) => {
        const formData = await request.formData()

        console.log("Deleting:")
        console.log({ formData })

        const { error: errorDelete } = await locals.supabase
            .from('types_of_leave')
            .delete()
            .eq('uuid', formData.get('uuid'))

        if (errorDelete) {
            console.error("Database Error:", errorDelete)
            return fail(500, {
                error: false,
                message: 'Failed to delete leave. Please try again later.'
            })
        }

        const { data, error: errorFetch } = await locals.supabase
            .from('types_of_leave')
            .select()

        console.log({ data })

        if (errorFetch) {
            console.error("Database Error:", errorFetch)
            return fail(500, {
                error: false,
                message: 'Failed to fetching leave. Please try again later.'
            })
        }

        console.log({ data })


        const list_of_leave: LeaveData[] = data.map(item => ({
            uuid: item.uuid,
            name: item.name,
            entitlement: item.entitlement,
            description: item.description,
        }))

        return { success: true, data: list_of_leave };
    }
};