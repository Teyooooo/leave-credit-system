<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { getInitials } from '$lib';
	import AccountInfoCard from '$lib/components/account-info-card.svelte';
	import * as Avatar from '$lib/components/ui/avatar';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Spinner } from '$lib/components/ui/spinner';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { user_name } from '$lib/store/userInfo';
	import { web_path_header } from '$lib/store/webDesignStore';
	import type { EmployeeData } from '$lib/types/data';
	import { FileClock, SquarePen } from '@lucide/svelte/icons';
	import { toast } from 'svelte-sonner';
	import type { PageProps } from './$types';

	$web_path_header = [{ path_name: 'Account Information', route: '/account-info' }];

	let { data, form }: PageProps = $props();

	// svelte-ignore state_referenced_locally
	let employee = $state(data.employee);
	let open = $state(false);
	let inSubmit = $state(false);
	let formName = $state('');

	$effect(() => {
		// Clear form error when dialog closes
		if (!open) form = null;
	});
</script>

<div class="mx-auto mt-10 flex w-full flex-col gap-2 px-2 xl:w-[70%]">
	<div class="flex w-full items-center">
		<div class="mb-4 flex grow items-center gap-10 xl:gap-3">
			<!-- svelte-ignore a11y_img_redundant_alt -->
			<Avatar.Root class="size-30 rounded-full text-4xl">
				<Avatar.Image src={employee.profile_pic} alt="Profile Picture" />
				<Avatar.Fallback>{getInitials(employee.name)}</Avatar.Fallback>
			</Avatar.Root>

			<div>
				<p class="text-2xl font-bold">{employee.name}</p>
				<div class="font-light">
					<Tooltip.Provider delayDuration={0}>
						<Tooltip.Root>
							<Tooltip.Trigger class="text-start">
								<p class="truncate">{employee.email}</p>
							</Tooltip.Trigger>
							<Tooltip.Content>
								<p class="font-bold">{employee.email}</p>
							</Tooltip.Content>
						</Tooltip.Root>
					</Tooltip.Provider>
					<p>{employee.employee_id}</p>
				</div>
			</div>
		</div>

		<div class="flex gap-4">
			<Button variant="outline" class="px-3 py-6" href="/account-info/account-logs"
				><FileClock class="size-6" /></Button
			>

			<Dialog.Root bind:open>
				<Dialog.Trigger class={[buttonVariants({ variant: 'outline' }), 'm-0! px-3 py-6']}>
					<SquarePen class="size-6" />
				</Dialog.Trigger>
				<form
					id="change-name-form"
					action="?/change_name"
					method="POST"
					use:enhance={() => {
						inSubmit = true;

						return async ({ result, update }) => {
							inSubmit = false;
							console.log({ result });

							if (result.type === 'success') {
								await update();

								employee = result.data?.employee as EmployeeData;
								$user_name = employee.name;
								toast.success('Your profile has been updated');

								open = false;
								form = null;
							} else {
								open = true;
								await applyAction(result);
							}
						};
					}}
				>
					<Dialog.Content class="sm:max-w-106.25">
						<Dialog.Header>
							<Dialog.Title>Edit profile</Dialog.Title>
							<Dialog.Description>
								Make changes to your profile here. Click save when you&apos;re done.
							</Dialog.Description>
						</Dialog.Header>
						<div class="grid gap-3">
							<Label for="name">Name</Label>
							<Input id="name" name="name" bind:value={formName} form="change-name-form" />
							{#if form?.error}
								<p class="text-sm text-red-600">{form?.message}</p>
							{/if}
						</div>
						<Dialog.Footer>
							<Dialog.Close class={buttonVariants({ variant: 'outline' })}>Cancel</Dialog.Close>
							<Button type="submit" form="change-name-form" disabled={inSubmit || !formName.length}>
								{#if inSubmit}
									<Spinner />
								{/if}
								Save changes</Button
							>
						</Dialog.Footer>
					</Dialog.Content>
				</form>
			</Dialog.Root>
		</div>
	</div>
	<AccountInfoCard {employee} />
</div>
