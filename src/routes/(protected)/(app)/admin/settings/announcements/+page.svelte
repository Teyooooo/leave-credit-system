<script lang="ts">
	import { enhance } from '$app/forms';
	import AnnouncementContainer from '$lib/components/announcement-container.svelte';
	import BackButton from '$lib/components/back-button.svelte';
	import HeaderPage from '$lib/components/header-page.svelte';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { RangeCalendar } from '$lib/components/ui/range-calendar';
	import { Spinner } from '$lib/components/ui/spinner';
	import { Textarea } from '$lib/components/ui/textarea';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { web_path_header } from '$lib/store/webDesignStore';
	import { convertTimestamp } from '$lib/utils/helper';
	import { getLocalTimeZone, today } from '@internationalized/date';
	import { Info, Plus } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	// svelte-ignore state_referenced_locally
	console.log({ data });

	$web_path_header = [
		{ path_name: 'Admin', route: '/admin/dashboard' },
		{ path_name: 'Settings', route: '/admin/settings' },
		{ path_name: 'Announcements', route: '/admin/settings/announcements' }
	];

	const announcements = $derived(data.announcements);

	const employeeEmails = $derived(data.employeeEmails);
	let TRIGGER_SEND_EMAIL = $state(false);

	let announcementTitle = $state('');
	let announcementDescription = $state('');
	let announcementValidUntil = $state('');

	import { untrack } from 'svelte';

	$effect(() => {
		if (TRIGGER_SEND_EMAIL) {
			const { title, description, validUntil, emails } = untrack(() => ({
				title: announcementTitle,
				description: announcementDescription,
				validUntil: announcementValidUntil,
				emails: employeeEmails
			}));

			const promise = fetch('/api/send-bulk-emails-announcement', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					title,
					description,
					validUntil,
					recipients: emails
				})
			})
				.then(async (res) => {
					const data = await res.json();
					if (!res.ok) throw new Error(data.message ?? 'Failed to send');
					return data;
				})
				.finally(() => {
					TRIGGER_SEND_EMAIL = false;
				});

			toast.promise(promise, {
				loading: 'Sending announcements...',
				success: (data) => `Sent to ${data.sent} recipient(s)!`,
				error: 'Error sending announcements.'
			});
		}
	});

	let submitState = $state(false);
	let errorState = $state<string | undefined>();
	let dialogState = $state(false);

	const start = today(getLocalTimeZone());
	const end = start.add({ days: 3 });

	let valid_until = $state({
		start,
		end
	});

	// Check if date range is complete
	let isDateRangeValid = $derived(valid_until.start && valid_until.end);
</script>

<BackButton route={'/admin/settings'} />

<div class="me-5 flex items-center">
	<div class="grow">
		<HeaderPage
			title={'Announcements'}
			message={'A centralized place for company-wide announcements and updates.'}
		/>
	</div>

	<Dialog.Root
		open={dialogState}
		onOpenChange={(open) => {
			dialogState = open;

			if (!open) {
				errorState = undefined;
			}
		}}
	>
		<Dialog.Trigger class={[buttonVariants()]}><Plus />Make New Announcement</Dialog.Trigger>
		<form
			action="?/add_announcement"
			method="post"
			id="add_announcement"
			use:enhance={({ formData }) => {
				// Validate date range before submission
				if (!valid_until.start || !valid_until.end) {
					errorState = 'Please select both start and end dates';
					return async ({ update }) => {
						await update({ reset: false });
					};
				}

				submitState = true;
				dialogState = true;

				// Convert dates to ISO strings
				const startDate = valid_until.start.toDate(getLocalTimeZone()).toISOString();
				const endDate = valid_until.end.toDate(getLocalTimeZone()).toISOString();

				formData.append('valid_until_start', startDate);
				formData.append('valid_until_end', endDate);

				announcementValidUntil = `${convertTimestamp(startDate, 'date')} - ${convertTimestamp(endDate, 'date')}`;

				return async ({ result, update }) => {
					submitState = false;

					if (result.type === 'failure') {
						const data = result.data as { message?: string };
						errorState = data?.message || 'An error occurred';
					}

					if (result.type === 'success') {
						dialogState = false;
						errorState = undefined;
						toast.success('Announcement added successfully');
						TRIGGER_SEND_EMAIL = true;
					}

					await update();
				};
			}}
		>
			<Dialog.Content class="w-md">
				<Dialog.Header>
					<Dialog.Title>New Announcement</Dialog.Title>
				</Dialog.Header>
				<div class="grid gap-3">
					<Label for="title">Title</Label>
					<Input
						id="title"
						name="title"
						form="add_announcement"
						bind:value={announcementTitle}
						required
					/>
				</div>

				<div class="grid gap-3">
					<Label for="details">Details</Label>
					<Textarea
						id="details"
						name="details"
						form="add_announcement"
						placeholder="Enter the announcement details here…"
						bind:value={announcementDescription}
					/>
				</div>
				<div class="grid gap-3">
					<Label for="valid_until">
						Valid Until
						<Tooltip.Provider>
							<Tooltip.Root>
								<Tooltip.Trigger class="inline-flex items-center">
									<Info class="size-4 text-muted-foreground hover:text-foreground" />
								</Tooltip.Trigger>

								<Tooltip.Content
									class="max-w-xs rounded-md bg-popover px-3 py-2 text-sm text-popover-foreground shadow-md"
									side="top"
									sideOffset={6}
								>
									<p>
										Valid Until indicates the last date this announcement will be visible to
										employees. After this date, the announcement will no longer be shown.
									</p>
								</Tooltip.Content>
							</Tooltip.Root>
						</Tooltip.Provider>
					</Label>
					<RangeCalendar
						bind:value={valid_until}
						id="valid_until"
						class="me-auto rounded-md border"
					/>
				</div>
				{#if !isDateRangeValid}
					<p class="text-sm text-red-600">
						Please select both start and end dates. To announce for a single day, click the same
						date twice or double-click it.
					</p>
				{/if}
				{#if errorState}
					<p class="text-sm text-red-600">{errorState}</p>
				{/if}
				<Dialog.Footer>
					<Dialog.Close class={buttonVariants({ variant: 'outline' })}>Cancel</Dialog.Close>
					<Button type="submit" form="add_announcement" disabled={submitState || !isDateRangeValid}>
						{#if submitState}
							<Spinner />
						{/if}
						Add Announcement</Button
					>
				</Dialog.Footer>
			</Dialog.Content>
		</form>
	</Dialog.Root>
</div>

<div class="mx-auto mt-10 w-[50%]">
	<AnnouncementContainer announcements={announcements || []} />
</div>
