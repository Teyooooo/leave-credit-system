<script lang="ts">
	import { page } from "$app/state";
	import * as Avatar from "$lib/components/ui/avatar";
	import * as Card from "$lib/components/ui/card";
	import { Separator } from "$lib/components/ui/separator";
	import type { LeaveHistory } from "$lib/types/data";
	import { convertTimestamp, getInitials } from "$lib/utils/helper";


    let { data } : { data: LeaveHistory } = $props()

    const pageName = page.url.pathname
    let isPageAtEmployeeSide = pageName === '/leave-request/history'



	function parseLeaveData(input: string | null): [string, number] {

		let result: [string, number] = ['', 0];

		if(!input) return result

		const [key, value] = input.trim().split(":");

		if(key === 'SLP'){
			result = ['Sick Leave', parseFloat(value.trim())];
		}else if(key === 'VLP'){
			result = ['Vacation Leave', parseFloat(value.trim())];

		}
		return result;
	}




	const leaveSnap = $derived(parseLeaveData(data.leave_points_snapshot)) 

</script>

		<Card.Header>
			<div class="flex items-center gap-4">
            {#if isPageAtEmployeeSide}
                <p class="text-sm font-light text-muted-foreground">
                    Type of Leave:
                </p>
                <p class="text-xl font-bold">{data.type_leave}</p>
            {:else}
                 <Avatar.Root class="size-15">
                     <Avatar.Image src={data.profile_pic_url} alt={data.employee_name} />
                     <Avatar.Fallback>{getInitials(data.employee_name)}</Avatar.Fallback>
                 </Avatar.Root>
 
                 <div class="grow">
                     <p class="text-xl font-bold">{data.employee_name}</p>
                     <p class="text-sm font-light text-muted-foreground">
                         {data.employee_department} - {data.employee_position}
                     </p>
                 </div>
            {/if}
			</div>
            <Separator class='my-2' />
		</Card.Header>
		<Card.Content
			class="**:text-sm [&_div>p:first-child]:font-light [&_div>p:first-child]:text-muted-foreground  [&_div>p:last-child]:font-semibold"
		>
			<div class="flex gap-3">
				{#if leaveSnap[0] === 'Vacation Leave'}
					<p>Vacation Points:</p>
					<p>
						{leaveSnap[1]}
					</p>
				{:else if leaveSnap[0] === 'Sick Leave'}
					<p>Sick Points:</p>
					<p>
						{leaveSnap[1]}
					</p>
				{/if}
			</div>
            {#if !isPageAtEmployeeSide}
                 <!-- content here -->
                 <div class="flex gap-3">
                    <p>Type of Leave:</p>
                    <p>
                        {data.type_leave}
                    </p>
                </div>
            {/if}
			<div class="flex gap-3">
				<p>Leave Date:</p>
				<p>
					{convertTimestamp(data.leave_start, 'date')} - {convertTimestamp(
						data.leave_end,
						'date'
					)}
				</p>
			</div>
			<div class="flex gap-3">
				<p>Total Days:</p>
				<p>
					{data.total_days}
					{data.total_days > 1 ? 'days' : 'day'}
				</p>
			</div>
			<div class="flex gap-3">
				<p>Contact Number:</p>
				<p>
					{data.contact_number}
				</p>
			</div>
			<div class="flex gap-3">
				<p>Reason:</p>
				<q class="italic">{data.reason}</q>
			</div>

            <Separator class='my-2' />

            <div class="flex gap-3">
				<p>Process by:</p>
				<p>{data.status === 'Decline' && data.hr_name === '-' ? 'Department Head' : data.hr_name}</p>
			</div>
            <div class="flex gap-3">
				<p>Process at:</p>
				<p>{convertTimestamp(data.processed_at, 'full')}</p>
			</div>
            {#if data.status === 'Decline'}
                <div class="flex gap-3">
                    <p>Reason for decline:</p>
                    <q class="italic text-red-600">{data.decline_reason}</q>
                </div>
            {/if}

			{#if data.type_leave === 'Sick Leave' || data.type_leave === 'Vacation Leave'}
				<Separator class='my-2' />
				<div class="flex gap-3">
					<p>Updated {leaveSnap[0]} Balance:</p>
					<p>{leaveSnap[1] - Number(data.total_days)}</p>
				</div>
			{/if}


			<p class="mt-3 text-[11px] font-light text-muted-foreground">
				Filed at: {convertTimestamp(data.date_filed, 'full')}
			</p>
		</Card.Content>