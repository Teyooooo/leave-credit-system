<script lang="ts">
	import { enhance } from '$app/forms';
	import { convertTimestamp, getInitials } from '$lib/utils/helper';
	import { ClipboardPenLine } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';
	import EmployeeCreditsCard from './employee-credits-card.svelte';
	import * as Avatar from './ui/avatar';
	import { Button, buttonVariants } from './ui/button';
	import * as Dialog from './ui/dialog';
	import { Input } from './ui/input';
	import { Label } from './ui/label';
	import { Spinner } from './ui/spinner';

	let { employee, creditPoints } = $props();


	let dialogStates = $state(false);
	let submitStates = $state(false);
	let errorStates = $state<string | undefined>();

</script>

<div class="w-full border bg-inherit">
	<div class="mx-auto flex w-fit gap-10 py-4">
		<Avatar.Root class="size-60 text-9xl">
			<Avatar.Image src={employee.profile_pic} alt={employee.name} />
			<Avatar.Fallback>{getInitials(employee.name)}</Avatar.Fallback>
		</Avatar.Root>
		<div>
			<div class="grid gap-2 py-3">
				<p class="grow font-light">Name</p>
				<p class="grow font-semibold">{employee.name}</p>
			</div>
			<div class="grid gap-2 py-3">
				<p class="font-light">ID</p>
				<p class="font-semibold">{employee.employee_id}</p>
			</div>
			<div class="grid gap-2 py-3">
				<p class="font-light">Email</p>
				<p class="font-semibold">{employee.email}</p>
			</div>
		</div>
		<div>
			<div class="grid gap-2 py-3">
				<p class="font-light">Department</p>
				<p class="font-semibold">{employee.department}</p>
			</div>
			<div class="grid gap-2 py-3">
				<p class="font-light">Position</p>
				<p class="font-semibold">{employee.position}</p>
			</div>
			<div class="grid gap-2 py-3">
				<p class="font-light">Verified</p>
				<p class="font-semibold">{employee.is_account_verified ? 'Yes' : 'No'}</p>
			</div>
		</div>
		<div>
			<div class="grid gap-2 py-3">
				<p class="font-light">Created at</p>
				<p class="font-semibold">{convertTimestamp(employee.created_at)}</p>
			</div>
			<div class="grid gap-2 py-3">
				<p class="font-light">System Role</p>
				<p class="font-semibold">{employee.role_in_system}</p>
			</div>
			<div class="mt-4">
				<Dialog.Root
					open={dialogStates}
					onOpenChange={(b) => {
						dialogStates = b;
					}}
				>
					<Dialog.Trigger class={[buttonVariants(), 'py-6']}
						><ClipboardPenLine class="size-8" /></Dialog.Trigger
					>
					<form
						action="?/add_credits"
						id="add_credits"
						method="POST"
						use:enhance={({ formData }) => {
							submitStates = true
							formData.append('uuid', employee.uuid);
							formData.append('sick_leave_balance', creditPoints?.sick_leave_points ?? 0)
							formData.append('vacation_leave_balance', creditPoints?.vacation_leave_points ?? 0)

							return async ({ result, update }) => {
								console.log(result);
								submitStates = false

								if(result.type === 'failure'){
									const data = result.data as { message?: string };
									errorStates = data?.message || 'Something went wrong'
								}

								if(result.type === 'success'){
									dialogStates = false
									errorStates = undefined
									toast.success('Monthly points issue added successfully')
								}

								await update()
							};
						}}
					>
						<Dialog.Content>
							<Dialog.Header>
								<Dialog.Title>Adding Credits</Dialog.Title>
							</Dialog.Header>
							<div class="grid gap-3">
								<Label for="vacation_leave">Vacation Leave Credits</Label>
								<Input
									id="vacation_leave"
									name="vacation_leave"
									form="add_credits"
									type="number"
									step="0.01"
									value="1.25"
									required
								/>
							</div>
							<div class="grid gap-3">
								<Label for="sick_leave">Sick Leave Credits</Label>
								<Input
									id="sick_leave"
									name="sick_leave"
									form="add_credits"
									type="number"
									step="0.01"
									value="1.25"
									required
								/>
							</div>
							<div class="grid gap-3">
								<Label for="balance_brought_forward">Balance Brought Forward</Label>
								<Input
									id="balance_brought_forward"
									name="balance_brought_forward"
									form="add_credits"
									type="number"
								/>
							</div>
							<!-- <div class="grid gap-3">
								<Label for="remarks">Remarks</Label>
								<Textarea
									id="remarks"
									name="remarks"
									form="add_credits"
									placeholder="Type here..."
								/>
							</div> -->
							{#if errorStates}
								<p class="text-sm text-red-600">{errorStates}</p>
							{/if}
							<Dialog.Footer>
								<Dialog.Close class={buttonVariants({ variant: 'outline' })}>Cancel</Dialog.Close>
								<Button
									type="submit"
									form="add_credits"
									disabled={submitStates}
								>
									{#if submitStates}
										<Spinner />
									{/if}
									Update
								</Button>
							</Dialog.Footer>
						</Dialog.Content>
					</form>
				</Dialog.Root>
			</div>
		</div>
	</div>
	<EmployeeCreditsCard {creditPoints} />
</div>
