import { writable } from "svelte/store";

export let user_name = writable("")
export let user_points = writable({
    vacation: 0,
    sick: 0
})