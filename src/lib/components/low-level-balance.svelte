<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';

</script>


<Card.Root class="mx-4 lg:mx-6">
  <Card.Header class="flex justify-between items-center">
    <Card.Title>Low Leave Balance</Card.Title>
    <Button variant={'link'}>View All</Button>
  </Card.Header>
  <Card.Content>
    <Table.Root>
      <Table.Caption>A list of your recent invoices.</Table.Caption>
      <Table.Header>
        <Table.Row>
          <Table.Head class="w-25">Invoice</Table.Head>
          <Table.Head>Status</Table.Head>
          <Table.Head>Method</Table.Head>
          <Table.Head class="text-right">Amount</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell class="font-medium">INV001</Table.Cell>
          <Table.Cell>Paid</Table.Cell>
          <Table.Cell>Credit Card</Table.Cell>
          <Table.Cell class="text-right">.00</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>
  </Card.Content>
</Card.Root>

