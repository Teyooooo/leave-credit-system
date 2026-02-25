import { convertTimestamp } from '$lib';
import type { RequestHandler } from '@sveltejs/kit';
import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';


export const POST: RequestHandler = async ({ request, locals }) => {
    try {
        const { data } = await request.json();
        console.log({data})

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
            "name": data.employee_name,
            "positionDepartment": `${data.employee_department} - ${data.employee_position}`,
            "dateFiled": convertTimestamp(data.date_filed, 'date'),
            "selectLeave": `${data.type_leave === 'Vacation Leave' ? '[✓]' : '[  ]'} Vacation Leave ${data.type_leave === 'Sick Leave' ? '[✓]' : '[  ]'} Sick Leave ${(data.type_leave != 'Sick Leave') && (data.type_leave != 'Vacation Leave') ? '[✓]' : '[  ]'} `,
            "otherLeave": `${(data.type_leave != 'Sick Leave') && (data.type_leave != 'Vacation Leave') ? data.type_leave : '-'}`,
            "leaveStart": convertTimestamp(data.leave_start, 'date'),
            "leaveEnd": convertTimestamp(data.leave_end, 'date'),
            "totalDays": data.total_days,
            "contactNumber": data.contact_number,
            "reasonForLeave": data.reason,
            "fullNameCapital": String(data.employee_name).toUpperCase(),
            "hrFullNameCapital": String(data.hr_name).toUpperCase(),
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
            'Content-Disposition': `attachment; filename="file.docx"`,
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
