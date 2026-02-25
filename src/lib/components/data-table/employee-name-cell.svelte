<script lang="ts">
	import { getInitials } from "$lib";
	import * as Avatar from "$lib/components/ui/avatar";

  interface Props {
    name: string;
    profile_pic?: string;
    id?: number;
    isALink?: true | false,
  }

  let { name, profile_pic, id, isALink = true }: Props = $props();

    const initials = $derived(getInitials(name))

</script>

<div class="flex items-center gap-3">
  <Avatar.Root class="h-8 w-8">
    <Avatar.Image src={profile_pic} alt={name} />
    <Avatar.Fallback>{initials}</Avatar.Fallback>
  </Avatar.Root>
  {#if isALink}
    <a href="/admin/employees/{id}" class="hover:underline">
      <span class="font-medium">{name}</span>
    </a>
  {:else}
      <span class="font-medium">{name}</span>
  {/if}

</div>