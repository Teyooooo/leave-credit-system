import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({locals}) => {
    const { data, error } = await locals.supabase
        .storage
        .from('Template')
        .list('', {
            search: 'template.docx'
        })

    const templateExists = !error && data && data.length > 0

    return {
        templateExists
    }
}) satisfies PageServerLoad;

export const actions: Actions = {
    upload_template: async ({ request, locals }) => {
    const formData = await request.formData()
    const file = formData.get('templateFile') as File

    if (!file || file.size === 0) {
        return fail(400, {
            error: true,
            message: 'Please select a file to upload'
        })
    }

     // Check if filename is exactly "template.docx"
    if (file.name !== 'template.docx') {
        return fail(400, {
            error: true,
            message: 'File name must be "template.docx"'
        })
    }

    // Upload with upsert (works either way)
    const { error } = await locals.supabase
        .storage
        .from('Template')
        .upload('template.docx', file, {
            upsert: true
        })

    if (error) {
        console.log("Upload Error:", error)
        return fail(500, {
            error: true,
            message: 'Failed to upload template'
        })
    }

    // logging  activity
    await locals.logActivity('Updated the Template file')

    return {
        success: true,
        message: 'Template uploaded successfully'
    }
}
};