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