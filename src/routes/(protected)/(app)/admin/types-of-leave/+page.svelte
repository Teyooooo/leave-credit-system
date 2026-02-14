<script lang="ts">
	import { enhance } from '$app/forms';
	import HeaderPage from '$lib/components/header-page.svelte';
	import LeaveCards from '$lib/components/leave-cards.svelte';
	import { Button } from '$lib/components/ui/button';
	import { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import Input from '$lib/components/ui/input/input.svelte';
	import { Label } from '$lib/components/ui/label';
	import { Spinner } from '$lib/components/ui/spinner';
	import { Textarea } from '$lib/components/ui/textarea';
	import { web_path_header } from '$lib/store/webDesignStore';
	import type { LeaveData } from '$lib/types/data';
	import { filterArray } from '$lib/utils/helper';
	import { Plus } from '@lucide/svelte';
	import type { PageProps } from './$types';
	import { toast } from "svelte-sonner";


	let { data, form }: PageProps = $props();

	$web_path_header = [
		{ path_name: 'Admin', route: '/admin/dashboard' },
		{ path_name: 'Types of Leave', route: '#' }
	];

    let form_data_leave = $derived<LeaveData[]>(form?.data || [])
    let list_of_leave = $derived<LeaveData[]>( form_data_leave.length === 0 ? data.data || [] : form_data_leave)
    let is_open = $state(false) // Back to false
    let inSubmit = $state(false)
	
	let searched_item = $state("")
	let filtered_item = $derived(filterArray<LeaveData>(searched_item, list_of_leave, 'name'))
	
    $effect(()=>{
		console.log({form, data})
        console.log({form_data_leave, list_of_leave})
		
        if (form?.success) {
			is_open = false;
        }
    })

</script>


<div class="me-2 mb-10 mt-5 flex flex-col gap-4 xl:flex-row justify-between items-center">
	<HeaderPage title={'Types of Leave'} message={'Add, Edit, Delete Leave in here.'} />

	<div class="flex justify-end gap-3">
		<Input type="text" placeholder="Search types..." bind:value={searched_item} class="w-50"></Input>
		<Dialog.Root 
			open={is_open}
			onOpenChange={((open)=> is_open = open)}
		>
			<Dialog.Trigger class={[buttonVariants()]}><Plus /> Add New Leave</Dialog.Trigger>
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
							<Dialog.Title>Add New Leave</Dialog.Title>
						</Dialog.Header>
						<div class="grid gap-3">
							<Label for="name">Name</Label>
							<Input id="name" name="name" form="add_leave" required/>

						</div>
						<div class="grid gap-3">
							<Label for="entitlement">Entitlement</Label>
							<Input id="entitlement" name="entitlement" placeholder="e.g. 15 Days / Year" form="add_leave" required/>

						</div>
						<div class="grid gap-3">
							<Label for="description">Description</Label>
							<Textarea id="description" name="description" form="add_leave"/>
						</div>
						{#if form?.error}
							<p class="text-sm text-red-600">{form?.message}</p>
						{/if}
						<Dialog.Footer>
							<Dialog.Close class={buttonVariants({ variant: 'outline' })}>Cancel</Dialog.Close>
							<Button type="submit" form="add_leave" disabled={inSubmit}>
								{#if inSubmit}
									<Spinner />
								{/if}
								Add Leave</Button>
						</Dialog.Footer>
					</Dialog.Content>
				</form>
		</Dialog.Root>
	</div>
</div>
<LeaveCards list_of_leave={filtered_item} {form} />