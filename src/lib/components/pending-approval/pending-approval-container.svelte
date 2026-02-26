<script lang="ts">
	import PendingApprovalCard from "$lib/components/pending-approval/pending-approval-card.svelte";
	import { Button } from "$lib/components/ui/button";
	import * as Card from "$lib/components/ui/card";
	import type { AdminFiledLeaveInfo, EmployeeData } from "$lib/types/data";
	import { Clipboard } from "@lucide/svelte";

  let { filedLeave, revieweeInfo, historyRoute } : { filedLeave: AdminFiledLeaveInfo[], revieweeInfo: EmployeeData, historyRoute: string} = $props()

</script>

<Card.Root class="w-full h-fit!">
  <Card.Header class='flex'>
    <Card.Title class="grow">Pending For Approval</Card.Title>
    <Button variant='link' href={historyRoute} >View History</Button>
  </Card.Header>
  <Card.Content class="grid gap-3">
    {#if filedLeave.length > 0}
       {#each filedLeave as i}
          <PendingApprovalCard  filedInfo={i} {revieweeInfo} />
       {/each}
    {:else}
        <div class="w-full h-50 flex flex-col justify-center items-center text-muted-foreground border border-dashed">
          <Clipboard />
          <p>No Pending Approval Leave</p>
        </div>
    {/if}
  </Card.Content>
</Card.Root>