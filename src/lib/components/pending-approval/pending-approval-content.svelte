<script lang="ts">
	import * as Avatar from "$lib/components/ui/avatar";
	import * as Card from "$lib/components/ui/card";
	import type { AdminFiledLeaveInfo } from "$lib/types/data";
	import { convertTimestamp, getInitials } from "$lib/utils/helper";


    let { filedInfo } : { filedInfo: AdminFiledLeaveInfo } = $props()
</script>

		<Card.Header class="mb-2">
			<div class="flex items-center gap-4">
				<Avatar.Root class="size-15">
					<Avatar.Image src={filedInfo.profile_pic_url} alt={filedInfo.employee_name} />
					<Avatar.Fallback>{getInitials(filedInfo.employee_name)}</Avatar.Fallback>
				</Avatar.Root>

				<div class="grow">
					<p class="text-xl font-bold">{filedInfo.employee_name}</p>
					<p class="text-sm font-light text-muted-foreground">
						{filedInfo.employee_department} - {filedInfo.employee_position}
					</p>
				</div>
			</div>
		</Card.Header>
		<Card.Content
			class="**:text-sm [&_div>p:first-child]:font-light [&_div>p:first-child]:text-muted-foreground  [&_div>p:last-child]:font-semibold"
		>
			<div class="flex gap-3">
				{#if filedInfo.type_leave.toLocaleLowerCase() === 'vacation leave'}
					<p>Vacation Points:</p>
					<p>
						{filedInfo.vacation_points}
					</p>
				{:else if filedInfo.type_leave.toLocaleLowerCase() === 'sick leave'}
					<p>Sick Points:</p>
					<p>
						{filedInfo.sick_points}
					</p>
				{/if}
			</div>
			<div class="flex gap-3">
				<p>Type of Leave:</p>
				<p>
					{filedInfo.type_leave}
				</p>
			</div>
			<div class="flex gap-3">
				<p>Leave Date:</p>
				<p>
					{convertTimestamp(filedInfo.leave_start, 'date')} - {convertTimestamp(
						filedInfo.leave_end,
						'date'
					)}
				</p>
			</div>
			<div class="flex gap-3">
				<p>Total Days:</p>
				<p>
					{filedInfo.total_days}
					{filedInfo.total_days > 1 ? 'days' : 'day'}
				</p>
			</div>
			<div class="flex gap-3">
				<p>Contact Number:</p>
				<p>
					{filedInfo.contact_number}
				</p>
			</div>
			<div class="flex gap-3">
				<p>Reason:</p>
				<q class="italic">{filedInfo.reason}</q>
			</div>

			<p class="mt-3 text-[11px] font-light text-muted-foreground">
				Filed at: {convertTimestamp(filedInfo.date_filed, 'full')}
			</p>
		</Card.Content>