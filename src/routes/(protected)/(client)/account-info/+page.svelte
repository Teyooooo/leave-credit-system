<script lang="ts">
	import { web_path_header } from '$lib/store/webDesignStore';
	import type { PageProps } from './$types';

    let { data }: PageProps = $props();

    // svelte-ignore state_referenced_locally
    let { employee } = data

    $web_path_header = "Account Information"

</script>

<div class="flex flex-col gap-2 mx-auto mt-10">
    <div class="flex gap-10 items-center">
        <!-- svelte-ignore a11y_img_redundant_alt -->
        <img src={employee.profilePic} alt="Profile Picture" class="size-30 rounded-full">

        <div>
            <p class="text-2xl font-bold">{employee.name}</p>
            <div class="font-light">
                <p>{employee.email}</p>
                <p>{employee.employee_id}</p>
            </div>
        </div>
    </div>


    <p>Name: {employee.name}</p>
    <p>ID: {employee.employee_id}</p>
    <p>Email: {employee.email}</p>
    <p>Department: {employee.department_id}</p>
    <p>Position: {employee.position}</p>
    <p>Employment Status: {employee.employment_status}</p>
</div>