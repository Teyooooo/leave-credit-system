<script lang="ts">
	import { enhance } from '$app/forms';
	import EmployeeNameCell from '$lib/components/data-table/employee-name-cell.svelte';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select';
	import { Spinner } from '$lib/components/ui/spinner';
	import type { Department, UserIcon } from '$lib/types/data';
	import { Building2, Pen, Trash, UserRound } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';

	let { department, listOfEmployees }: { department: Department; listOfEmployees: UserIcon[]} = $props();

    //Dialog-Form States
	let updateDialogStates = $state<Record<string, boolean>>({});
	let updateSubmitStates = $state<Record<string, boolean>>({});
	let updateErrorStates = $state<Record<string, string | undefined>>({});

	let deleteDialogStates = $state<Record<string, boolean>>({});
	let deleteSubmitStates = $state<Record<string, boolean>>({});
    let deleteErrorStates = $state<Record<string, string | undefined>>({});

    //Update Form Data
    let formDeptName = $derived(department.name)
    let formDeptHead = $derived(department.head_uuid)
	let selectTriggerContent = $derived(
		listOfEmployees.find((f) => f.uuid === formDeptHead)?.name ?? 'Select a employee'
	);

    // Check if there is a change in the form
    let haveChange = $derived(
        formDeptName !== department.name || 
        formDeptHead !== department.head_uuid
    )

</script>

<div>

<Card.Root class="flex">
        <Card.Header class="flex gap-3 items-center">
        <Building2 />
        <Card.Title>{department.name}</Card.Title>
    </Card.Header>
    <Card.Content class="grow">
        <p class="text-sm/6 text-muted-foreground">Department Head:</p>
        <div class="flex gap-2 items mt-2">
            <UserRound />
            <p class="text-4 font-bold">{department.head_name}</p>
        </div>
    </Card.Content>
    <Card.Footer class="flex justify-end-safe gap-1">
        <Button variant='outline' onclick={()=> updateDialogStates[department.uuid] = true }><Pen /> </Button>
        <Button variant='destructive' onclick={()=> deleteDialogStates[department.uuid] = true }><Trash /></Button>
    </Card.Footer>
</Card.Root>

<!-- Update Form -->
<Dialog.Root
    open={updateDialogStates[department.uuid]}
    onOpenChange={open => {
        updateDialogStates[department.uuid] = open;
        if (!open) {
            updateErrorStates[department.uuid] = undefined;
        }
    }}
>
    <form
        id="update_department_{department.uuid}"
        action="?/update_department"
        method="POST"
        use:enhance={({ formData }) => {
            updateSubmitStates[department.uuid] = true;
            updateDialogStates[department.uuid] = true;

            formData.append('old_dept_head', department.head_uuid)
            formData.append('new_dept_head', formDeptHead ?? undefined);
            formData.append('uuid', department.uuid)

            return async ({ result, update }) => {
                updateSubmitStates[department.uuid] = false;
                console.log({ result });

                if (result.type === 'failure') {
                    const data = result?.data as { message?: string };
                    updateErrorStates[department.uuid] = data.message;
                }

                if (result.type === 'success') {
                    updateDialogStates[department.uuid] = false;
                    toast.success('Department updated successfully');
                }

                await update();
            };
        }}
    >
        <Dialog.Content class="sm:max-w-106.25">
            <Dialog.Header>
                <Dialog.Title>Update Department ({department.name})</Dialog.Title>
            </Dialog.Header>
            <div class="grid gap-3">
                <Label for="name">Name</Label>
                <Input id="name" name="name" form="update_department_{department.uuid}" bind:value={formDeptName} required />
            </div>
            <div class="grid gap-3">
                <Label for="dept_head">Department Head</Label>
                <Select.Root type="single" name="dept_head" bind:value={formDeptHead}>
                    <Select.Trigger class="w-full">
                        {selectTriggerContent}
                    </Select.Trigger>
                    <Select.Content>
                        <Select.Group>
                            <Select.Label>Employees</Select.Label>
                            {#each listOfEmployees as employee}
                                <Select.Item value={employee.uuid}>
                                    <EmployeeNameCell
                                        name={employee.name}
                                        id={employee.employee_id}
                                        profile_pic={employee.profile_pic}
                                        isALink={false}
                                    />
                                </Select.Item>
                            {/each}
                        </Select.Group>
                    </Select.Content>
                </Select.Root>
            </div>
            {#if updateErrorStates[department.uuid]}
                <p class="text-sm text-red-600">{updateErrorStates[department.uuid]}</p>
            {/if}
            <Dialog.Footer>
                <Dialog.Close class={buttonVariants({ variant: 'outline' })}>Cancel</Dialog.Close>
                <Button type="submit" form="update_department_{department.uuid}" disabled={!haveChange || updateSubmitStates[department.uuid]}>
                    {#if updateSubmitStates[department.uuid]}
                        <Spinner />
                    {/if}
                    Update Department
                </Button>
            </Dialog.Footer>
        </Dialog.Content>
    </form>
</Dialog.Root>

<!-- Delete Form -->
 <Dialog.Root
    open={deleteDialogStates[department.uuid]}
    onOpenChange={open => {
        deleteDialogStates[department.uuid] = open;
        if (!open) {
            deleteErrorStates[department.uuid] = undefined;
        }
    }}
>
    <form
        id="delete_department_{department.uuid}"
        action="?/delete_department"
        method="POST"
        use:enhance={({ formData }) => {
            deleteSubmitStates[department.uuid] = true;
            deleteDialogStates[department.uuid] = true;

            formData.append('dept_head', department.head_uuid);
            formData.append('uuid', department.uuid)

            return async ({ result, update }) => {
                deleteSubmitStates[department.uuid] = false;
                console.log({ result });

                if (result.type === 'failure') {
                    const data = result?.data as { message?: string };
                    deleteErrorStates[department.uuid] = data.message;
                }

                if (result.type === 'success') {
                    deleteDialogStates[department.uuid] = false;
                    toast.success('Department deleted successfully');
                }

                await update();
            };
        }}
    >
        <Dialog.Content class="sm:max-w-106.25">
            <Dialog.Header>
                <Dialog.Title>Delete Department ({department.name})</Dialog.Title>
                 <Dialog.Description>
                    This action cannot be undone. This will permanently delete department "{department.name}"
                    and remove it from our servers.
                </Dialog.Description>
            </Dialog.Header>
            {#if deleteErrorStates[department.uuid]}
                <p class="text-sm text-red-600">{deleteErrorStates[department.uuid]}</p>
            {/if}
            <Dialog.Footer>
                <Dialog.Close class={buttonVariants({ variant: 'outline' })}>Cancel</Dialog.Close>
                <Button type="submit" variant="destructive" form="delete_department_{department.uuid}" disabled={deleteSubmitStates[department.uuid]}>
                    {#if deleteSubmitStates[department.uuid]}
                        <Spinner />
                    {/if}
                    Delete Department
                </Button>
            </Dialog.Footer>
        </Dialog.Content>
    </form>
</Dialog.Root>
</div>
