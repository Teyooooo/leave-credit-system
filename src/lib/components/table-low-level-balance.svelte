<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';

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
        <Table.Row>
						<Table.Cell colspan={5} class="text-center text-muted-foreground">
              No data available
            </Table.Cell>
					</Table.Row>

        <!-- <Table.Row>
          <Table.Cell class="font-medium">INV001</Table.Cell>
          <Table.Cell>Paid</Table.Cell>
          <Table.Cell>Credit Card</Table.Cell>
          <Table.Cell class="text-right">.00</Table.Cell>
        </Table.Row> -->
      </Table.Body>
    </Table.Root>
  </Card.Content>
</Card.Root>

