<script lang="ts">
	import EmployeeNameCell from '$lib/components/data-table/employee-name-cell.svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import type { LowLevelBalance } from '$lib/types/data';

  let { data } : { data:LowLevelBalance[] } = $props() 

</script>


<Card.Root class="mx-4 lg:mx-6">
  <Card.Header class="flex justify-between items-center">
    <Card.Title>Low Leave Balance</Card.Title>
  </Card.Header>
  <Card.Content>
    <Table.Root>
      <Table.Header>
        <Table.Row>
          <Table.Head class="w-25">ID</Table.Head>
          <Table.Head>Name</Table.Head>
          <Table.Head>Email</Table.Head>
          <Table.Head>Vacation Leave Balance</Table.Head>
          <Table.Head>Sick Leave Balance</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {#if data.length === 0}
            <Table.Row>
             <Table.Cell colspan={5} class="text-center text-muted-foreground">
               No data available
             </Table.Cell>
            </Table.Row>
          {:else}
             {#each data as i}
              <Table.Row>
                <Table.Cell class="font-medium">{i.employee_id}</Table.Cell>
                <Table.Cell><EmployeeNameCell name={i.name} profile_pic={i.profile_pic} id={i.employee_id} /> </Table.Cell>
                <Table.Cell>{i.email}</Table.Cell>
                <Table.Cell>{i.vacation_leave_points}</Table.Cell>
                <Table.Cell>{i.sick_leave_points}</Table.Cell>
              </Table.Row>
             {/each}
          {/if}
      </Table.Body>
    </Table.Root>
  </Card.Content>
</Card.Root>

