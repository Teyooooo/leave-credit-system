<script lang="ts">

	let { title, message }: {title: String, message: String} = $props();

</script>

<div class="px-4 lg:px-6">
	<h1 class="text-4xl font-bold">{title}</h1>
	<p class="text-sm/6">
        {message}
	</p>
</div>
