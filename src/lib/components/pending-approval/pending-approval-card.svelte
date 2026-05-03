<script lang="ts">
	import { enhance } from '$app/forms';
	import PendingApprovalContent from '$lib/components/pending-approval/pending-approval-content.svelte';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as Dialog from '$lib/components/ui/dialog';
	import Label from '$lib/components/ui/label/label.svelte';
	import { Spinner } from '$lib/components/ui/spinner';
	import { Textarea } from '$lib/components/ui/textarea';
	import type { AdminFiledLeaveInfo, EmployeeData } from '$lib/types/data';
	import { convertTimestamp } from '$lib/utils/helper';
	import { CircleCheck, CircleX } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';

	let { filedInfo, revieweeInfo }: { filedInfo: AdminFiledLeaveInfo; revieweeInfo: EmployeeData } = $props();

	let approveDialogStates = $state<Record<string, boolean>>({});
	let approveSubmitStates = $state<Record<string, boolean>>({});
	let declineDialogStates = $state<Record<string, boolean>>({});
	let declineSubmitStates = $state<Record<string, boolean>>({});
</script>

<Card.Root class="flex flex-row! gap-4">
	<div class="grow">
		<PendingApprovalContent {filedInfo} />
	</div>
	<Card.Footer class="flex min-w-40 flex-col-reverse gap-2 *:w-full">
		<Button
			class="bg-green-500 hover:bg-green-500/70"
			onclick={() => (approveDialogStates[filedInfo.filed_uuid] = true)}
			><CircleCheck /> Approve</Button
		>
		<Button
			class="bg-red-600 text-amber-50 hover:bg-red-600/70"
			onclick={() => (declineDialogStates[filedInfo.filed_uuid] = true)}><CircleX /> Decline</Button
		>
	</Card.Footer>
</Card.Root>

<!-- dialog for approve -->
<Dialog.Root
	open={approveDialogStates[filedInfo.filed_uuid] || false}
	onOpenChange={(open) => {
		approveDialogStates[filedInfo.filed_uuid] = open;
	}}
>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title class="mb-5">Approving Requested Leave</Dialog.Title>
			<PendingApprovalContent {filedInfo} />
		</Dialog.Header>

		<Dialog.Footer>
			<Dialog.Close class={buttonVariants({ variant: 'outline' })}>Cancel</Dialog.Close>
			<form
				id="approve_filed_{filedInfo.filed_uuid}"
				action="?/approve_filed"
				method="post"
				use:enhance={({ formData }) => {
					
					formData.append('reviewee_uuid', revieweeInfo.uuid);
					formData.append('reviewee_name', revieweeInfo.name);
					formData.append('reviewee_position', revieweeInfo.position);
					formData.append('applicant_uuid', filedInfo.employee_uuid);
					formData.append('applicant_email', filedInfo.employee_email);
					formData.append('sick_leave_points', String(filedInfo.sick_points));
					formData.append('vacation_leave_points', String(filedInfo.vacation_points));
					formData.append('type_leave', filedInfo.type_leave);
					formData.append('start_date', convertTimestamp(filedInfo.leave_start, 'date'));
					formData.append('end_date', convertTimestamp(filedInfo.leave_end, 'date'));
					formData.append('total_days', String(filedInfo.total_days));
					formData.append('uuid', filedInfo.filed_uuid);
					formData.append('applicant_name', filedInfo.employee_name);
					formData.append('applicant_id', filedInfo.employee_id);


					approveSubmitStates[filedInfo.filed_uuid] = true;

					return async ({ result, update }) => {
						approveSubmitStates[filedInfo.filed_uuid] = false;
						console.log({ result });

						if (result.type === 'failure') {
							const data = result.data as { message?: string };
							toast.error(data?.message || 'An error occurred');
						}

						if (result.type === 'success') {
							toast.success('Approving filed leave successfully');
						}

						approveDialogStates[filedInfo.filed_uuid] = false;
						await update();
					};
				}}
			>
				<Button
					type="submit"
					class="bg-green-500 hover:bg-green-500/70"
					form="approve_filed_{filedInfo.filed_uuid}"
					disabled={approveSubmitStates[filedInfo.filed_uuid]}
				>
					{#if approveSubmitStates[filedInfo.filed_uuid]}
						<Spinner />
					{/if}Approve
				</Button>
			</form>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<!-- dialog for decline -->
<Dialog.Root
	open={declineDialogStates[filedInfo.filed_uuid] || false}
	onOpenChange={(open) => {
		declineDialogStates[filedInfo.filed_uuid] = open;
	}}
>
	<form
		id="decline_filed_{filedInfo.filed_uuid}"
		action="?/decline_filed"
		method="post"
		use:enhance={({ formData }) => {

			formData.append('reviewee_uuid', revieweeInfo.uuid);
			formData.append('reviewee_name', revieweeInfo.name);
			formData.append('reviewee_position', revieweeInfo.position);
			formData.append('uuid', filedInfo.filed_uuid);
			formData.append('applicant_name', filedInfo.employee_name);
			formData.append('applicant_email', filedInfo.employee_email);
			formData.append('applicant_uuid', filedInfo.employee_uuid);
			formData.append('type_leave', filedInfo.type_leave);
			formData.append('start_date', convertTimestamp(filedInfo.leave_start, 'date'));
			formData.append('end_date', convertTimestamp(filedInfo.leave_end, 'date'));
			formData.append('total_days', String(filedInfo.total_days));

			declineSubmitStates[filedInfo.filed_uuid] = true;

			return async ({ result, update }) => {
				declineSubmitStates[filedInfo.filed_uuid] = false;
				console.log({ result });

				if (result.type === 'failure') {
					const data = result.data as { message?: string };
					toast.error(data?.message || 'An error occurred');
				}

				if (result.type === 'success') {
					toast.success('Declining filed leave successfully');
				}

				declineDialogStates[filedInfo.filed_uuid] = false;
				await update();
			};
		}}
	>
		<Dialog.Content>
			<Dialog.Header>
				<Dialog.Title class="mb-5 text-red-600">Declining Requested Leave</Dialog.Title>
				<PendingApprovalContent {filedInfo} />
			</Dialog.Header>

			<div class="grid gap-2">
				<Label for="reason">Reason</Label>
				<Textarea id="reason" name="reason" form="decline_filed_{filedInfo.filed_uuid}" required />
			</div>

			<Dialog.Footer>
				<Dialog.Close class={buttonVariants({ variant: 'outline' })}>Cancel</Dialog.Close>
				<Button
					type="submit"
					class="bg-red-600 text-amber-50 hover:bg-red-600/70"
					form="decline_filed_{filedInfo.filed_uuid}"
					disabled={declineSubmitStates[filedInfo.filed_uuid]}
				>
					{#if declineSubmitStates[filedInfo.filed_uuid]}
						<Spinner />
					{/if}Decline
				</Button>
			</Dialog.Footer>
		</Dialog.Content>
	</form>
</Dialog.Root>
