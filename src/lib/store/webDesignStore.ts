import web_logo from "$lib/assets/leave_credit_system_logo.png";
import type { Department, PathHeader } from "$lib/types/data";
import { writable } from "svelte/store";


export const title = 'Leave Credit System';
export const logo = web_logo;
export let web_path_header = writable<PathHeader[]>([]);
// for the department select
export let departments = writable<Department[]>([]);