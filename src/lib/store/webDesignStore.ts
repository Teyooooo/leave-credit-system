import web_logo from "$lib/assets/leave_credit_system_logo.png";
import type { PathHeader } from "$lib/types/data";
import { writable } from "svelte/store";


export const title = 'Leave Credit System';
export const logo = web_logo;
export let web_path_header = writable<PathHeader[]>([]);
// for the department select
export const departments: string[] = [
    'College of Technology',
    'College of Art and Sciences',
    'College of Education',
    'Bachelor of Science in Fisheries',
    'College of Industrial Engineering',
    'Bachelor of Science and Hospitality Management',
    'Human Resources',
    'Administration'
];