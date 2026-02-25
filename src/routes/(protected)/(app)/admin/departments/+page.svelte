<script lang="ts">
	import { enhance } from '$app/forms';
	import HeaderPage from '$lib/components/header-page.svelte';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Spinner } from '$lib/components/ui/spinner';
	import { web_path_header } from '$lib/store/webDesignStore';
	import { Plus } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';
	import type { PageProps } from './$types';

    let { data }: PageProps = $props();


	$web_path_header = [
		{ path_name: 'Admin', route: '/admin/dashboard' },
		{ path_name: 'Departments', route: '/admin/departments' }
	];

    // let form_data_leave = $derived<LeaveData[]>(form?.data || [])
    // let list_of_leave = $derived<LeaveData[]>( form_data_leave.length === 0 ? data.data || [] : form_data_leave)
    let is_open = $state(false) // Back to false
    let inSubmit = $state(false)
	
	let searched_item = $state("")
	// let filtered_item = $derived(filterArray<LeaveData>(searched_item, list_of_leave, 'name'))
	

</script>

<div class="me-2 mb-10 mt-5 flex flex-col gap-4 xl:flex-row justify-between items-center">
	<HeaderPage title={'Departments'} message={'Manage and view the different departments within the organization.'} />

	<div class="flex justify-end gap-3">
		<Input type="text" placeholder="Search department..." bind:value={searched_item} class="w-50"></Input>
		<Dialog.Root 
			open={is_open}
			onOpenChange={((open)=> is_open = open)}
		>
			<Dialog.Trigger class={[buttonVariants()]}><Plus /> Add New Department</Dialog.Trigger>
			<form id="add_leave" action="?/add_leave" method="POST" use:enhance={()=>{

					inSubmit = true
					is_open = true

					return async ({ result, update }) => {
						inSubmit = false
						console.log({result})

						if (result.type === 'success'){
							is_open = false
							toast.success("Leave added successfully")
						}

						await update();

					}
				}}>
					<Dialog.Content class="sm:max-w-106.25">
						<Dialog.Header>
							<Dialog.Title>Add New Department</Dialog.Title>
						</Dialog.Header>
						<div class="grid gap-3">
							<Label for="name">Name</Label>
							<Input id="name" name="name" form="add_leave" required/>

						</div>
						<div class="grid gap-3">
							<Label for="dept_head">Department Head</Label>
							<Input id="dept_head" name="dept_head" form="add_leave" required/>

						</div>
						<!-- {#if form?.error}
							<p class="text-sm text-red-600">{form?.message}</p>
						{/if} -->
						<Dialog.Footer>
							<Dialog.Close class={buttonVariants({ variant: 'outline' })}>Cancel</Dialog.Close>
							<Button type="submit" form="add_leave" disabled={inSubmit}>
								{#if inSubmit}
									<Spinner />
								{/if}
								Add Department</Button>
						</Dialog.Footer>
					</Dialog.Content>
				</form>
		</Dialog.Root>
	</div>
</div>