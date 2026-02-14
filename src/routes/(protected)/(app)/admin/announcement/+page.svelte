<script lang="ts">
	import HeaderPage from '$lib/components/header-page.svelte';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Info, Plus } from '@lucide/svelte';
	import type { PageProps } from './$types';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Spinner } from '$lib/components/ui/spinner';
	import { Textarea } from '$lib/components/ui/textarea';
	import { RangeCalendar } from '$lib/components/ui/range-calendar';
	import { getLocalTimeZone, today } from '@internationalized/date';
	import { enhance } from '$app/forms';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { web_path_header } from '$lib/store/webDesignStore';
	import AnnouncementContainer from '$lib/components/announcement-container.svelte';
	import { toast } from 'svelte-sonner';

	let { data }: PageProps = $props();

    $web_path_header = [
		{ path_name: 'Admin', route: '/admin/dashboard' },
		{ path_name: 'Announcement', route: '/admin/announcement' }
	];

    const announcements = $derived(data.announcements)

    $effect(()=>{
        console.log(announcements)
    })

	let submitState = $state(false);
    let errorState = $state<string | undefined>();
    let dialogState = $state(false);

	const start = today(getLocalTimeZone());
	const end = start.add({ days: 3 });

	let valid_until = $state({
		start,
		end
	});
</script>

<div class="me-5 flex items-center">
	<div class="grow">
		<HeaderPage
			title={'Announcement'}
			message={'A centralized place for company-wide announcements and updates.'}
		/>
	</div>

	<Dialog.Root open={dialogState}
        onOpenChange={open => {
            dialogState = open

            if(!open){
                errorState = undefined
            }
        }}    
    >
		<Dialog.Trigger class={[buttonVariants()]}><Plus />Make New Announcement</Dialog.Trigger>
		<form
			action="?/add_announcement"
			method="post"
			id="add_announcement"
			use:enhance={({ formData }) => {
                submitState = true
                dialogState = true

				// Convert dates to ISO strings
				if (valid_until.start && valid_until.end) {
					const startDate = valid_until.start.toDate(getLocalTimeZone()).toISOString();
					const endDate = valid_until.end.toDate(getLocalTimeZone()).toISOString();

					formData.append('valid_until_start', startDate);
					formData.append('valid_until_end', endDate);
				}

                return async ({result, update}) => {
                    console.log({result})
                    submitState = false

                    if(result.type === 'failure'){
                        const data = result.data as { message?: string };
                        errorState = data?.message || 'An error occurred';
                    }

                    if (result.type === 'success') {
                        dialogState = false;
                        errorState = undefined;
						toast.success("Announcement added successfully")
                    }

                    await update();

                }
			}}
		>
			<Dialog.Content class="w-md">
				<Dialog.Header>
					<Dialog.Title>New Announcement</Dialog.Title>
				</Dialog.Header>
				<div class="grid gap-3">
					<Label for="title">Title</Label>
					<Input id="title" name="title" form="add_announcement" required />
				</div>

				<div class="grid gap-3">
					<Label for="details">Details</Label>
					<Textarea
						id="details"
						name="details"
						form="add_announcement"
						placeholder="Enter the announcement details here…"
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
						class="mx-auto rounded-md border"
					/>
				</div>
				{#if errorState}
							<p class="text-sm text-red-600">{errorState}</p>
						{/if}
				<Dialog.Footer>
					<Dialog.Close class={buttonVariants({ variant: 'outline' })}>Cancel</Dialog.Close>
					<Button type="submit" form="add_announcement" disabled={submitState}>
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


<div class="w-[50%] mx-auto mt-10">
    <AnnouncementContainer announcements={announcements || []} />
</div>