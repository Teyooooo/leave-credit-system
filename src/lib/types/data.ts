export interface EmployeeData {
    uuid: string,
    profile_pic: string,
    employee_id: number,
    name: string,
    email: string,
    department: string,
    position: string,
    role_in_system: string
}

export interface EmployeeDataAdmin {
    uuid: string,
    profile_pic: string,
    employee_id: number,
    name: string,
    email: string,
    department: string,
    position: string,
    created_at: string,
    is_account_verified: boolean,
    role_in_system: string
}

export interface ActivityLogsEmployee {
    timestamp: string,
    details: string,
}

export interface ActivityLogsAdmin {
    timestamp: string,
    details: string,
    name: string,
    profile_pic: string,
}

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
    vacation_leave_points: number
}

export interface IssuedLogs{
    uuid: string,
    created_at: string,
    late_per_mins: number,
    sick_leave_earned: number,
    vacation_leave_earned: number,
    sick_leave_balance: number,
    vacation_leave_balance: number,
    remarks: string,
    employee_uuid: string
}

export interface RecentReports {
    timestamp: string,
    type: string,
    details: string
}

export interface AnnouncementInfo {
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