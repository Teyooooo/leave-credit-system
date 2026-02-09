import type { ActivityLogsEmployee } from '$lib/types/data';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({locals, parent}) => {
    const parentData = await parent()
    const employeeInfo = parentData.employee

    const {data, error} = await locals.supabase
        .from('activity_logs')
        .select()
        .eq('employee_uuid', employeeInfo.uuid)

    if(error){
        console.log('Database Error:', error)
        return fail(500, {
            error: true,
            message: 'Failed to fetch data to server.'
        })
    }

    const logs: ActivityLogsEmployee[] = data.map( item => ({
        timestamp: item.created_at,
        details: item.details,
    }))

    return {
        logs
    };
}) satisfies PageServerLoad;