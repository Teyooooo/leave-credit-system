import { writable } from "svelte/store";


export let user_points  = writable({
    vacation_points : 0,
    sick_points : 0
})