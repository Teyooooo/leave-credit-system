<script lang="ts">
	import HeaderPage from '$lib/components/header-page.svelte';
	import PushNotification from '$lib/components/push-notification.svelte';
	import * as  Card from '$lib/components/ui/card';
    import type { PageProps } from './$types';

    let { data }: PageProps = $props();
    let { employee, userIsSubscription } = $derived(data);

</script>

<HeaderPage title={'Settings'} />

<div class="mt-10 grid gap-10 px-4 lg:px-6">
	<Card.Root>
		<Card.Header>
			<Card.Title>Push Notifications</Card.Title>
		</Card.Header>
		<Card.Content>
        <PushNotification {employee} {userIsSubscription} />
		</Card.Content>
	</Card.Root>
</div>