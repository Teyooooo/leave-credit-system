<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Spinner } from '$lib/components/ui/spinner';
	import type { EmployeeDataAdmin } from '$lib/types/data';
	import { toast } from 'svelte-sonner';

	let { data }: { data: EmployeeDataAdmin } = $props();

	let reActiveAccountDialogStates = $state(false);
	let reActiveAccountSubmitStates = $state(false);
	let reActiveAccountErrorStates = $state<string | undefined>();
</script>

<Dialog.Root
	bind:open={reActiveAccountDialogStates}
	onOpenChange={open => {
		reActiveAccountDialogStates = open
	}}
>
	<Dialog.Trigger class={buttonVariants({})} disabled={reActiveAccountSubmitStates}>
		{#if reActiveAccountSubmitStates}
			<Spinner />
		{/if}
		Reactive
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Reactivate Account ({data.name})</Dialog.Title>
			<Dialog.Description>
				This action will reactivate the account and restore access to the system.
			</Dialog.Description>
		</Dialog.Header>
		<form
			action="?/re_active"
			method="post"
			id="re_active"
			use:enhance={({ formData }) => {
				reActiveAccountSubmitStates = true;
				reActiveAccountDialogStates = false;
				formData.append('uuid', data.uuid);
				formData.append('id', String(data.employee_id));
				formData.append('name', data.name)

				return async ({ result, update }) => {
					reActiveAccountSubmitStates = false;
					console.log({ result });

					if (result.type === 'failure') {
						const data = result.data as { message?: string };
						reActiveAccountErrorStates = data?.message || 'An error occurred';
						toast.error(reActiveAccountErrorStates)
					}

					if (result.type === 'success') {
						reActiveAccountDialogStates = false;
						reActiveAccountErrorStates = undefined;
						toast.success(`Employee "${data.name}" has re-activated successfully`);
					}

					await update();
				};
			}}
		>
			<Dialog.Footer>
				<Dialog.Close class={buttonVariants({ variant: 'outline' })}>Cancel</Dialog.Close>
				<Button type="submit" form="re_active">Proceed</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>