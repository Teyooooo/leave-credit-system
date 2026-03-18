<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import type { EmployeeData } from '$lib/types/data';

	export let employee: EmployeeData;
</script>

<Card.Root class="w-full rounded-md! p-0!">
	<Card.Content>
		<div class="border-b-2 py-5 text-lg font-bold">
			<Card.Title>Information</Card.Title>
		</div>
		<div class="grid grid-cols-2 gap-2 border-b-2 py-3">
			<p class="grow font-light">Name</p>
			<p class="grow font-semibold">{employee.name}</p>
		</div>
		<div class="grid grid-cols-2 gap-2 border-b-2 py-3">
			<p class="font-light">ID</p>
			<p class="font-semibold">{employee.employee_id}</p>
		</div>
		<div class="grid grid-cols-2 gap-2 border-b-2 py-3">
			<p class="font-light">Email</p>
			<Tooltip.Provider delayDuration={0}>
				<Tooltip.Root>
					<Tooltip.Trigger class="text-start">
						<p class="truncate font-semibold">{employee.email}</p>
					</Tooltip.Trigger>
					<Tooltip.Content>
						<p class="font-semibold">{employee.email}</p>
					</Tooltip.Content>
				</Tooltip.Root>
			</Tooltip.Provider>
		</div>
		<div class="grid grid-cols-2 gap-2 border-b-2 py-3">
			<p class="font-light">Department</p>
			<p class="font-semibold">{employee.department}</p>
		</div>
		<div class="grid grid-cols-2 gap-2 py-3">
			<p class="font-light">Position</p>
			<p class="font-semibold">{employee.position}</p>
		</div>
	</Card.Content>
</Card.Root>
