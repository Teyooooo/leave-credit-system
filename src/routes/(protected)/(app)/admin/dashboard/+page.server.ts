import type { AdminDashboardInfo, LowLevelBalance } from '$lib/types/data';
import type { PageServerLoad } from './$types';

export const load = (async ({locals}) => {

    // Getting the total employees
    const { count: totalEmployees, error: totalEmployeesError } = await locals.supabase
        .from('employees')
        .select('*', { count: 'exact', head: true })

    let employees  = 0
    if(!totalEmployeesError){
        employees = Number(totalEmployees) 
    }


    // Getting the total pending, approved, declined
    const [
    { count: pending },
    { count: approved },
    { count: declined }
    ] = await Promise.all([
    locals.supabase
        .from('filed_leave')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Pending'),
    locals.supabase
        .from('filed_leave')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Approve'),
    locals.supabase
        .from('filed_leave')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Decline')
    ])

    let filedInfo = {
    pending: pending ?? 0,
    approved: approved ?? 0,
    declined: declined ?? 0
    }

    // Getting the 10 lowest leave points
    let { data: creditPoints, error: creditPointsError } = await locals.supabase
    .from('credit_points')
    .select('*, employee_info: employees!employee_uuid(employee_id, employee_name, profile_pic_url, email)')
    .order('vacation_leave_points', { ascending: true })
    .order('sick_leave_points', { ascending: true })
    .limit(10)

    let lowPoints: LowLevelBalance[] = []
    if(!creditPointsError){
        
        creditPoints?.forEach(i => console.log({i}) )

        lowPoints = creditPoints?.map(i => ({
            name: i?.employee_info?.employee_name ?? '-',
            employee_id: i?.employee_info?.employee_id ?? '-',
            email: i?.employee_info?.email ?? '-',
            profile_pic: i?.employee_info?.profile_pic_url ?? '-',
            sick_leave_points: i?.sick_leave_points ?? 0,
            vacation_leave_points: i?.vacation_leave_points ?? 0
        })) ?? []
    }
          

            



    let cardInfo: AdminDashboardInfo = {
        employees,
        pending: filedInfo.pending,
        approved: filedInfo.approved,
        declined: filedInfo.declined
    }

    return {
        cardInfo,
        lowPoints
    };
}) satisfies PageServerLoad;