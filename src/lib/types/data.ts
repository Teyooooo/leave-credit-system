export interface EmployeeData {
    uuid: string,
    profile_pic: string,
    employee_id: number,
    name: string,
    email: string,
    department_uuid: string,
    department: string,
    position: string,
    role_in_system: string
}

export interface EmployeeDataAdmin extends EmployeeData {
    created_at: string,
    is_account_verified: boolean,
}

export interface ActivityLogsEmployee {
    timestamp: string,
    details: string,
}

export interface ActivityLogsAdmin 
    extends ActivityLogsEmployee, 
    Pick<EmployeeData, 'name' | 'profile_pic'> {}

export interface PathHeader {
	path_name: string;
	route: string;
}

export interface LeaveData {
    uuid: string,
    name: string,
    entitlement: string,
    description: string
}

export interface CreditPointsInfo {
    id: number,
    created_at: string,
    updated_at: string,
    late_per_mins: number,
    sick_leave_points: number,
    vacation_leave_points: number,
    period: string,
}

export interface IssuedLogs{
    uuid: string,
    created_at: string,
    late_per_mins: number,
    sick_leave_earned: number,
    vacation_leave_earned: number,
    sick_leave_balance: number,
    vacation_leave_balance: number,
    employee_uuid: string,
    deducted_late: number,
    remarks: string,
    period: string,
}

export interface RecentReports {
    timestamp: string,
    type: string,
    details: string
}

export interface AnnouncementInfo {
    uuid: string,
    created_at: string,
    title: string,
    details: string,
    valid_until_start: string,
    valid_until_end: string, 
    type: string
}

export interface LeaveRequestInfo {
    name: string,
    department: string,
    position: string,
    date_filed: string,
    type_leave: string,
    leave_start: string,
    leave_end: string,
    total_days: string | number,
    contact_number: string | number,
    reason: string,
    hr_name: string
}

export interface ClientFiledLeaveInfo {
    uuid: string,
    date_filed: string,
    type_leave: string,
    leave_start: string,
    leave_end: string,
    total_days: number,
    contact_number: string,
    reason: string,
    status: string,
    hr_name: string
} 

export interface AdminFiledLeaveInfo {
    employee_uuid: string,
    employee_name: string,
    employee_id: string,
    employee_email: string,
    employee_department: string,
    employee_position: string,
    profile_pic_url: string,

    employee_points_id: number,
    sick_points: number,
    vacation_points:number,
    
    filed_uuid: string,
    date_filed: string,
    type_leave: string,
    leave_start: string,
    leave_end: string,
    total_days: number,
    contact_number: string,
    reason: string,
    hr_name: string
}

export type LeaveStatus = 'none' | 'pending' | 'approved' | 'declined'

export interface LeaveHistory extends AdminFiledLeaveInfo {
    status: string;
    processed_at: string;
    decline_reason: string;
    leave_points_snapshot: string;
    dept_head_name: string;
}

export interface IssuedLeaveHistory {
    uuid: string;
    created_at: string;
    leave_title: string,
    leave_start: string,
    leave_end: string,
    total_days: number,
    leave_points_snapshot: string;
    hr_uuid: string;
    hr_name: string;
}

export interface AdminDashboardInfo {
    employees: number;
}

export interface LowLevelBalance 
    extends Pick<EmployeeData, 'name' | 'email' | 'employee_id' | 'profile_pic'>, 
    Pick<CreditPointsInfo, 'sick_leave_points' | 'vacation_leave_points'> {}

export interface LeaveBalanceSheet extends IssuedLogs {
    total_vacation_leave_points_used: number;
    total_sick_leave_points_used: number;
}

export interface Department 
    extends Pick<LeaveData, 'name' | 'uuid' >  {
        created_at: string;
        head_uuid: string;
        head_name: string;
}

export interface UserIcon
    extends Pick<EmployeeData, 'uuid' | 'employee_id' | 'name' | 'profile_pic'>{}