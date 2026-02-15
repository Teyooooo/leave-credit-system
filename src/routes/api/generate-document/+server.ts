import type { RequestHandler } from '@sveltejs/kit';
import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';

//TODO: add the template upload
/**
 * 1. add the employee leave balance sheet (bisag table ra unya na ang mga values)
 * 2. insert or update sa template.docx
 * 3. implement the request leave
 * 4. refactor the ui of the admin, add settings tab and put the activity logs, announcements, and template in there
 * 5. implement the activity log tracker
 */


export const POST: RequestHandler = async ({ request, locals }) => {
    try {
        const { data } = await request.json();
        const { data: fileData, error } = await locals.supabase
            .storage
            .from('Template')
            .download('template.docx')

        if (error) throw error

        // Convert blob to array buffer
        const arrayBuffer = await fileData.arrayBuffer();

        // Load the docx file as binary content
        const zip = new PizZip(arrayBuffer);

        // Create docxtemplater instance
        const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
        });


        doc.render({
            name: `<u>${data.name}</u>`,
            positionDepartment: `<u>${data.department} - ${data.position}</u>`,
            dateFiled: `<u>${data.date_filed}</u>`,
            selectedLeave: `
            ${data.type_leave === 'Vacation Leave' ? '☑' : '☐'} Vacation Leave 
            ${data.type_leave === 'Sick Leave' ? '☑' : '☐'} Sick Leave
            ${(data.type_leave != 'Sick Leave') && (data.type_leave != 'Vacation Leave') ? '☑' : '☐'} Other: <u>${data.type_leave}</u>
            `,
            leaveStart: `<u>${data.leave_start}</u>`,
            leaveEnd: `<u>${data.leave_end}</u>`,
            totalDays: `<u>${data.total_days}</u>`,
            contactNumber: `<u>${data.contact_number}</u>`,
            reason: `<u>${data.reason}</u>`,
            fullNameCapital: `<u>${data.name.toUpperCase()}</u>`,
            hrFullNameCapital: `<u>${data.hr_name.toUpperCase()}</u>`,
        });

        //Generate as blob
        const blob = doc.getZip().generate({
        type: 'blob',
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        compression: 'DEFLATE',
        });

        // Return the blob
        return new Response(blob, {
        headers: {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'Content-Disposition': 'attachment; filename="generated-document.docx"',
        },
        });

    } catch (error) {
        console.error('Error generating document:', error);
        return new Response(JSON.stringify({ error }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }

};
