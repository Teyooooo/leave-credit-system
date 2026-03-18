import type { AnnouncementInfo } from '$lib/types/data';
import type { BulkRecipient } from '$lib/utils/emailHelper';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({locals}) => {

    const [
        { data: announcementsData, error: announcementsError },
        { data: employeesData, error: employeesError }
    ] = await Promise.all([
        locals.supabase
        .from('announcement')
        .select()
        .order('created_at', {ascending: false}),
        locals.supabase
        .from('employees')
        .select(`employee_name, email, is_account_active`)
    ])
    
    if(announcementsError || employeesError){
        return { errorMessage: 'Failed to fetch data to server.'}
    }   
    
    const announcements: AnnouncementInfo[] = announcementsData?.map((i)=>({
        uuid: i.uuid,
        created_at: i.created_at,
        title: i.title,
        details: i.details,
        valid_until_start: i.valid_until_start,
        valid_until_end: i.valid_until_end,
        type: 'all'
    }))
    
    const activeAccounts = employeesData.filter( i => i.is_account_active)
    const employeeEmails: BulkRecipient[] = activeAccounts?.map((i)=>({
        name : i.employee_name,
        email : i.email
    }))

    return { announcements, employeeEmails };
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
                message: 'Failed to add new announcement. Please try again.'
            })
        }

        await locals.logActivity(`Created Announcement "${title}"`)

        return {success: true}
    },
    remove_announcement : async ({request, locals}) => {
        const formData = await request.formData()
        const uuid = formData.get('uuid')
        const title = formData.get('title')



        const { error } = await locals.supabase
            .from('announcement')
            .delete()
            .eq('uuid', uuid)

        if(error){
            console.log("Database Error:", error)
            return fail(500, {
                error: true,
                message: 'Failed to delete announcement. Please try again.'
            })
        }

        await locals.logActivity(`Deleted Announcement "${title}"`)

        return {success: true}
    }
};