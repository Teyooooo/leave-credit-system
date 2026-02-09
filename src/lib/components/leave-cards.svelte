<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Spinner } from '$lib/components/ui/spinner';
	import { Textarea } from '$lib/components/ui/textarea';
	import type { LeaveData } from '$lib/types/data';
	import { Clock, Pen, Trash } from '@lucide/svelte';
	import type { ActionData } from '../../routes/$types';

	let { list_of_leave, form }: { list_of_leave: LeaveData[]; form?: ActionData } = $props();

	let path_name = $derived(page.url.pathname);
	let inAdminRoute = $derived(path_name.startsWith('/admin'));
	
	// Simple state objects
	let editDialogStates = $state<Record<string, boolean>>({});
	let deleteDialogStates = $state<Record<string, boolean>>({});

	let editSubmitStates = $state<Record<string, boolean>>({});
	let deleteSubmitStates = $state<Record<string, boolean>>({});

	let editErrorStates = $state<Record<string, string | undefined>>({});
    let deleteErrorStates = $state<Record<string, string | undefined>>({});

</script>

<div class="mx-6 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
	{#each list_of_leave as leave}
		<Card.Root class="flex">
			<Card.Header>
				<Card.Title>{leave.name}</Card.Title>
				<Card.Description class="mt-2 flex items-center gap-1"
					><Clock class="size-4" />
					{leave.entitlement}
				</Card.Description>
			</Card.Header>
			<Card.Content class="grow">
				<p class="text-sm/6">{leave.description}</p>
			</Card.Content>
			{#if inAdminRoute}
				<Card.Footer class="flex justify-end-safe gap-1">
					<Dialog.Root 
						open={editDialogStates[leave.uuid] || false} 
						onOpenChange={(open) =>{ 
							editDialogStates[leave.uuid] = open

							if(!open){
								editErrorStates[leave.uuid] = undefined
							}
							}}
					>
						<Dialog.Trigger class={[buttonVariants({ variant: 'outline' })]}><Pen /></Dialog.Trigger>
						<form
							id="edit_leave_{leave.uuid}"
							action="?/edit_leave"
							method="post"
							use:enhance={({formData}) => {
								formData.append("uuid", leave.uuid)
								editSubmitStates[leave.uuid] = true;

								return async ({ result, update }) => {
									editSubmitStates[leave.uuid] = false;
									console.log({ result });

									if (result.type === 'failure') {
										const data = result.data as { message?: string }
										editErrorStates[leave.uuid] = data?.message || 'An error occurred'
									}

									if (result.type === 'success') {
										editErrorStates[leave.uuid] = undefined
										editDialogStates[leave.uuid] = false;
									}
									await update();
								};
							}}
						>
							<Dialog.Content>
								<Dialog.Header>
									<Dialog.Title>Edit Leave</Dialog.Title>
								</Dialog.Header>
								<div class="grid gap-3">
									<Label for="name_{leave.uuid}">Name</Label>
									<Input id="name_{leave.uuid}" name="name" form="edit_leave_{leave.uuid}" value={leave.name ?? ""} required />
								</div>
								<div class="grid gap-3">
									<Label for="entitlement_{leave.uuid}">Entitlement</Label>
									<Input
										id="entitlement_{leave.uuid}"
										name="entitlement"
										placeholder="e.g. 15 Days / Year"
										form="edit_leave_{leave.uuid}"
										value={leave.entitlement ?? ""}
										required
									/>
								</div>
								<div class="grid gap-3">
									<Label for="description_{leave.uuid}">Description</Label>
									<Textarea id="description_{leave.uuid}" name="description" form="edit_leave_{leave.uuid}" value={leave.description ?? ""} required/>
								</div>
								{#if editErrorStates[leave.uuid]}
									<p class="text-sm text-red-600">{editErrorStates[leave.uuid]}</p>
								{/if}
								<Dialog.Footer>
									<Dialog.Close class={buttonVariants({ variant: 'outline' })}>Cancel</Dialog.Close>
									<Button type="submit" form="edit_leave_{leave.uuid}" disabled={editSubmitStates[leave.uuid]}>
										{#if editSubmitStates[leave.uuid]}
											<Spinner />
										{/if}Update</Button
									>
								</Dialog.Footer>
							</Dialog.Content>
						</form>
					</Dialog.Root>

					<Dialog.Root 
						open={deleteDialogStates[leave.uuid] || false} 
						onOpenChange={(open) => {
							deleteDialogStates[leave.uuid] = open

							if(!open){
								deleteErrorStates[leave.uuid] = undefined
							}
							}}
					>
						<Dialog.Trigger class={[buttonVariants({ variant: 'destructive' })]}
							><Trash /></Dialog.Trigger
						>
						<Dialog.Content>
							<Dialog.Header>
								<Dialog.Title>Are you absolutely sure?</Dialog.Title>
								<Dialog.Description>
									This action cannot be undone. This will permanently delete this leave and remove
									your data from our servers.
								</Dialog.Description>
							</Dialog.Header>
								{#if deleteErrorStates[leave.uuid]}
									<p class="text-sm text-red-600">{deleteErrorStates[leave.uuid]}</p>
								{/if}
							<Dialog.Footer>
								<Dialog.Close class={buttonVariants({ variant: 'outline' })}>Cancel</Dialog.Close>
								<form 
									id="delete_leave_{leave.uuid}"
									action="?/delete_leave" 
									method="post"
									use:enhance={({formData}) => {
										formData.append("uuid", leave.uuid);
										deleteSubmitStates[leave.uuid] = true;

										return async ({ result, update }) => {
											deleteSubmitStates[leave.uuid] = false;
											console.log({ result });

											if( result.type === 'failure' ){
												const data = result.data as { message?: string}
												deleteErrorStates[leave.uuid] = data?.message || 'An error occurred'
											}

											if (result.type === 'success') {
												deleteErrorStates[leave.uuid] = undefined
												deleteDialogStates[leave.uuid] = false;
											}
											await update();
										};
									}}
								>
									<Button 
										type="submit" 
										variant="destructive" 
										form="delete_leave_{leave.uuid}"
										disabled={deleteSubmitStates[leave.uuid]}
									>
										{#if deleteSubmitStates[leave.uuid]}
											<Spinner />
										{/if}Delete
									</Button>
								</form>
							</Dialog.Footer>
						</Dialog.Content>
					</Dialog.Root>
				</Card.Footer>
			{/if}
		</Card.Root>
	{/each}
</div>