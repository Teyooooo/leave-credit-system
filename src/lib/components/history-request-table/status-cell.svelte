<script lang="ts">

    let { status }: { status:string } = $props();

</script>

<p class='font-medium {status === 'Decline' ? 'text-red-600' : 'text-green-600' }'>{status}</p>