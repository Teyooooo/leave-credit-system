<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input';
	import { Spinner } from '$lib/components/ui/spinner';

	export let form: { error: string } | null;

	let inSubmit = false
</script>

<Card.Root>
	<Card.Header class="text-center">
		<Card.Title class="text-xl">Enter your ID</Card.Title>
		<Card.Description>Input your employee ID to verify your account</Card.Description>
	</Card.Header>
	<Card.Content>
		<form method="POST" action="?/verifyID" use:enhance={()=>{

			inSubmit = true

			return async ({ result })=>{

				await applyAction(result)
				inSubmit = false
				
			}
		}}>
			<Input name="employeeID" type="number" placeholder="Employee ID" required />

			{#if form?.error}
				<p class="text-start text-sm text-red-600 mt-2">
					{form.error}
				</p>
			{/if}

			<Button type="submit" class="mt-4 w-full" disabled={inSubmit}>
				{#if inSubmit}
					<Spinner />
				{/if}
				Verify
			</Button>
		</form>
	</Card.Content>
</Card.Root>
