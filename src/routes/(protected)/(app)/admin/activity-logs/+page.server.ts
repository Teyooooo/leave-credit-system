import type { ActivityLogsAdmin } from '$lib/types/data';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({locals, parent}) => {
    const parentData = await parent()
    const employeeInfo = parentData.employee

    const {data, error} = await locals.supabase
        .from('activity_logs')
        .select(`*, 
                employees(
                    profile_pic_url,
                    employee_name
                )`)

    if(error){
        console.log('Database Error:', error)
        return fail(500, {
            error: true,
            message: 'Failed to fetch data to server.'
        })
    }

    const logs: ActivityLogsAdmin[] = data.map( item => ({
        timestamp: item.created_at,
        details: item.details,
        name: item.employees?.employee_name,
        profile_pic: item.employees?.profile_pic_url
    }))

    return {
        logs
    };
}) satisfies PageServerLoad;