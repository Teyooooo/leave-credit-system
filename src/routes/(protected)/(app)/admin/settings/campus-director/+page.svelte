<script lang="ts">
	import BackButton from '$lib/components/back-button.svelte';
	import HeaderPage from '$lib/components/header-page.svelte';
	import { web_path_header } from '$lib/store/webDesignStore';
	import * as Card from '$lib/components/ui/card';
    import { Button } from '$lib/components/ui/button';
	import { enhance } from '$app/forms';
	import * as Select from '$lib/components/ui/select';
	import { Spinner } from '$lib/components/ui/spinner';
    import type { PageProps } from './$types';
	import EmployeeNameCell from '$lib/components/data-table/employee-name-cell.svelte';
	import { toast } from 'svelte-sonner';
	import { Upload } from '@lucide/svelte';

    let { data }: PageProps = $props();
    const {employees, campusDirector } = $derived(data)

    // svelte-ignore state_referenced_locally
        console.log({employees, campusDirector})

    let updateSubmitState = $state(false);
	let updateSubmitError = $state<string | undefined>();


    $web_path_header = [
		{ path_name: 'Admin', route: '/admin/dashboard' },
		{ path_name: 'Settings', route: '/admin/settings' },
		{ path_name: 'Campus Director', route: '/admin/settings/campus-director' }
	];

    let selectValue = $state('');
	const selectTriggerContent = $derived(
        employees.find((f) => f.uuid === selectValue)?.name ?? 'Select a employee'
	);

    let selectedEmployee = $derived(employees.find((f) => f.uuid === selectValue))
</script>

<BackButton route={"/admin/settings"} />

<HeaderPage
	title={'Campus Director'}
	message={'Update and view the current Campus Director.'}
/>

<div class="mt-10 grid gap-10 px-4 lg:px-6">
	<Card.Root>
		<Card.Header>
			<Card.Title>Current Campus Director</Card.Title>
		</Card.Header>
		<Card.Content>
        <div class="border p-2 rounded-lg">
            {#if campusDirector}
            <EmployeeNameCell name={campusDirector.name} profile_pic={campusDirector.profile_pic} id={campusDirector.employee_id}  />
            {:else}
            <EmployeeNameCell name={'Not Assigned'} isALink={false}  />
            {/if}
        </div>
        </Card.Content>
	</Card.Root>

<Card.Root>
    <Card.Header>
        <Card.Title>Update Campus Director</Card.Title>
    </Card.Header>

    <form 
        action="?/update_campus_director" 
        id="form_campus_director" 
        method="post" 
        enctype="multipart/form-data"
        use:enhance={({ formData })=>{

            if(campusDirector){
                formData.append('current_campus_director_uuid', campusDirector.uuid)
            }

            if(selectedEmployee){
                formData.append('uuid', selectedEmployee.uuid)
                formData.append('name', selectedEmployee.name)
                formData.append('id', String(selectedEmployee.employee_id))
            }

            updateSubmitState = true

            return async ({result, update}) => {
                console.log({result})
                
                if(result.type === 'failure'){
                    const data = result.data as { message?: string}
                    updateSubmitError = data?.message || 'An error occurred';
                }

                if(result.type === 'success'){
                    updateSubmitError = undefined

                    const data = result.data as { message?: string}
                    toast.success(data?.message || 'Update successfully')
                }

            updateSubmitState = false
            await update()
            }
        }}
    >
        <Card.Content class="flex flex-row items-start gap-5">
            <div class="grid w-full max-w-sm items-center gap-1.5">
            <Select.Root type="single" name="dept_head" bind:value={selectValue}>
                <Select.Trigger class="w-full">
                    {selectTriggerContent}
                </Select.Trigger>
                <Select.Content>
                    <Select.Group>
                        <Select.Label>Employees</Select.Label>
                        {#each employees as employee}
                            <Select.Item value={employee.uuid}>
                                <EmployeeNameCell
                                    name={employee.name}
                                    id={employee.employee_id}
                                    profile_pic={employee.profile_pic}
                                    isALink={false}
                                />
                            </Select.Item>
                        {/each}
                    </Select.Group>
                </Select.Content>
            </Select.Root>
            {#if updateSubmitError}
                <p class="text-sm text-red-600 my-2">{updateSubmitError}</p>
            {/if}
            
            </div>
            <Button form="form_campus_director" type="submit" disabled={updateSubmitState || !selectValue}>
                {#if updateSubmitState}
                    <Spinner />
                {/if}
                Update
          </Button>
            
        </Card.Content>
    </form>
</Card.Root>
</div>