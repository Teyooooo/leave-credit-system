import type { LeaveData } from "$lib/types/data";

export function getInitials(fullName: string): string {
    // Split the full name by spaces
    const names = fullName.trim().split(/\s+/);

    if (names.length === 0) return '';

    // Take the first letter of the first and last word only
    const firstInitial = names[0].charAt(0).toUpperCase();
    const lastInitial = names.length > 1 ? names[names.length - 1].charAt(0).toUpperCase() : '';

    return firstInitial + lastInitial;
}

export function filterLeave(search_value: string, lists_of_leave: LeaveData[]){
    
        if(search_value === "") return lists_of_leave

        return lists_of_leave.filter( (leave) => leave.name.toLowerCase().includes(search_value.toLowerCase()))
}