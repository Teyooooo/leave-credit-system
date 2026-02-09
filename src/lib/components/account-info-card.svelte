<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import type { EmployeeData } from '$lib/types/data';

	export let employee: EmployeeData;
</script>

<Card.Root class="p-0! rounded-md! w-full">
	<Card.Content>
		<div class="border-b-2 py-5 text-lg font-bold">
			<Card.Title>Information</Card.Title>
		</div>
		<div class="grid grid-cols-2 gap-2 border-b-2 py-3">
			<p class="font-light grow">Name</p>
			<p class="font-semibold grow">{employee.name}</p>
		</div>
		<div class="grid grid-cols-2 gap-2 border-b-2 py-3">
			<p class="font-light">ID</p>
			<p class="font-semibold">{employee.employee_id}</p>
		</div>
		<div class="grid grid-cols-2 gap-2 border-b-2 py-3">
			<p class="font-light">Email</p>
			<p class="font-semibold">{employee.email}</p>
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
