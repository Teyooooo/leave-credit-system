<script lang="ts">
	import FiledLeavePendingCard from "$lib/components/filed_leave_pending_card.svelte";
	import { Button } from "$lib/components/ui/button";
	import * as Card from "$lib/components/ui/card";
	import type { ClientFiledLeaveInfo, EmployeeData, LeaveData } from "$lib/types/data";
	import { Clipboard } from "@lucide/svelte";

  let { filedLeave, employee, listsOfLeave } : { filedLeave: ClientFiledLeaveInfo[], employee: EmployeeData, listsOfLeave: LeaveData[] } = $props()

  let pendingFiledLeave: ClientFiledLeaveInfo[] = $state([])
  $effect(()=>{
     pendingFiledLeave = filedLeave.filter(i =>  i?.status?.toLocaleLowerCase() === 'pending')
  })

</script>

<Card.Root class="w-full h-fit!">
  <Card.Header class="flex items-center">
    <Card.Title class="grow">Waiting For Approval</Card.Title>
    <Button variant='link' href="/leave-request/history" >View History</Button>
  </Card.Header>
  <Card.Content class="grid gap-3">
    {#if pendingFiledLeave.length > 0}
       {#each pendingFiledLeave as i}
          <FiledLeavePendingCard  filedInfo={i} {employee} {listsOfLeave} />
       {/each}
    {:else}
        <div class="w-full h-50 flex flex-col justify-center items-center text-muted-foreground border border-dashed">
          <Clipboard />
          <p>No Pending Filed Leave</p>
        </div>
    {/if}
  </Card.Content>
</Card.Root>