import { getTotalDays } from '$lib';
import type { ClientFiledLeaveInfo, CreditPointsInfo, LeaveData } from '$lib/types/data';
import { parseDate } from '@internationalized/date';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({locals, parent}) => {
    const { employee } = await parent()

    // Getting the current balance and late 
    const { data: currentPoints, error: currentPointsError } = await locals.supabase
        .from('credit_points')
        .select(`*, credit_monthly_issued( late_per_mins, created_at )`)
        .eq('employee_uuid', employee?.uuid)
        .single()

    let creditInfo: CreditPointsInfo | undefined
    if(currentPointsError){
        console.error("Fetching Data Error:", currentPointsError)
        creditInfo = undefined

    }else{        
        creditInfo = {
            id: currentPoints?.id,
            created_at: currentPoints?.created_at,
            updated_at: currentPoints?.credit_monthly_issued?.created_at,
            late_per_mins: currentPoints?.credit_monthly_issued?.late_per_mins,
            sick_leave_points: currentPoints?.sick_leave_points,
            vacation_leave_points: currentPoints?.vacation_leave_points,
            period: currentPoints?.period
        }
    }

    // Getting the list of leave types
    const { data: listsLeave, error: listsLeaveError } = await locals.supabase
        .from('types_of_leave')
        .select()
        .eq('is_active', true)

    let listsOfLeave: LeaveData[] = [] 
    if (listsLeaveError) {
        console.error("Database Error:", listsLeaveError)
    }else{
         listsOfLeave = listsLeave.map(item => ({
            uuid: item.uuid,
            name: item.name,
            entitlement: item.entitlement,
            description: item.description,
        }))
    }

    // Getting the all the filed leave
    const { data: filedLeave, error: filedLeaveError } = await locals.supabase
        .from('filed_leave')
        .select(`*, 
            hr: employees!hr_uuid( employee_name ), 
            leave_name: types_of_leave!type_of_leave( name )`
        )
        .eq('employee_uuid', employee?.uuid)
        .order('date_filed', { ascending: false })

    console.log({filedLeave})
    filedLeave?.forEach(item => console.log(item.leave_name))

    let allFiledLeave: ClientFiledLeaveInfo[] = []
    if(filedLeaveError){
        console.error("Fetching Filed Leave Error:", filedLeaveError)
    }else{
        allFiledLeave = filedLeave.map(item => ({
            uuid: item.uuid,
            date_filed: item.date_filed,
            type_leave: item.leave_name?.name ?? '-',
            leave_start: item.leave_start,
            leave_end: item.leave_end,
            total_days: getTotalDays( parseDate(item.leave_start.slice(0,10)), parseDate(item.leave_end.slice(0,10)) ),
            contact_number: item.contact_number,
            reason: item.reason,
            status: item.status,
            hr_name: item.hr?.employee_name ?? '-',
            approve_by_dept_head: item.approve_by_dept_head,
            approve_by_CD: item.approve_by_CD,
        }))
    }


    return { listsOfLeave, creditInfo, allFiledLeave };

}) satisfies PageServerLoad;

export const actions: Actions = {
    file_leave: async ({request, locals}) => {
        const formData = await request.formData()

        console.log({formData})

        const { error } = await locals.supabase
            .from('filed_leave')
            .insert({
                employee_uuid: formData.get('employee_uuid'),
                type_of_leave: formData.get('type_of_leave'),
                leave_start: formData.get('date_range_start'),
                leave_end: formData.get('date_range_end'),
                contact_number: formData.get('contact_number'),
                reason: formData.get('reason'),
                status: 'Pending'
            })

        if(error){
            console.log("Filing Leave Error:", error)
            return fail(500, {
                error: true,
                message: "Failed to file the leave. Try again later."
            })
        }   
        
        return { success: true }
    },
    edit_filed: async ({request, locals}) => {
        const formData = await request.formData()

        console.log({formData})

        const { error } = await locals.supabase
            .from('filed_leave')
            .update({
                employee_uuid: formData.get('employee_uuid'),
                type_of_leave: formData.get('type_of_leave'),
                leave_start: formData.get('date_range_start'),
                leave_end: formData.get('date_range_end'),
                contact_number: formData.get('contact_number'),
                reason: formData.get('reason'),
                status: 'Pending'
            })
            .eq('uuid', formData.get('uuid'))

        if(error){
            console.log("Updating Filed Leave Error:", error)
            return fail(500, {
                error: true,
                message: "Failed to update filed leave. Try again later."
            })
        }   
        
        return { success: true }
    },
    delete_filed: async ({request, locals}) => {
        const formData = await request.formData()

        console.log({formData})

        const { error } = await locals.supabase
            .from('filed_leave')
            .delete()
            .eq('uuid', formData.get('uuid'))

        if(error){
            console.log("Deleting Filed Leave Error:", error)
            return fail(500, {
                error: true,
                message: "Failed to delete filed leave. Try again later."
            })
        }   
        
        return { success: true }
    }
};