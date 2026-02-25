import { getJsonCookie } from "$lib/server/cookies";
import type { AnnouncementInfo, EmployeeData } from "$lib/types/data";
import { segregateAnnouncements } from "$lib/utils/helper";
import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, cookies}) => {
    const { data: { session } } = await locals.supabase.auth.getSession();
    const employee = getJsonCookie<EmployeeData>(cookies, "employee_data")

    // Don't redirect if we're on the auth callback route
    if (!session) {
        throw redirect(303, '/login');
    }

    if (employee === null){
        throw redirect(303, '/auth/signout');
    }

    // Getting the latest active announcements
    const { data, error } = await locals.supabase
    .from('announcement')
    .select()
    .order('valid_until_start', {ascending: false})
    .limit(5)

    // console.log({data})
    let announcements:AnnouncementInfo[] = []
    let activeAnnouncements:AnnouncementInfo[] = []
    if(!error){
        announcements = data?.map((i)=>({
            title: i.title,
            details: i.details,
            created_at: i.created_at,
            valid_until_start: i.valid_until_start,
            valid_until_end: i.valid_until_end, 
            type: 'all'
        })) 
        const { activeAnnouncements: segregateActive } = segregateAnnouncements(announcements)
        activeAnnouncements = segregateActive
    }else{
        console.log("Getting announcement error:", error)
    }

    return {
        employee,
        activeAnnouncements
    };
};