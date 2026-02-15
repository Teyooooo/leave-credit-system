import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
    const { data, error } = await locals.supabase
        .storage
        .from('Template')
        .download('template.docx')

    if (error) {
        return new Response('Failed to download template', { status: 500 })
    }

    return new Response(data, {
        headers: {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'Content-Disposition': 'attachment; filename="template.docx"' // This triggers the download!
        }
    })
}