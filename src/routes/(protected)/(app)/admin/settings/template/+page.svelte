<script lang="ts">
	import { enhance } from '$app/forms';
	import TemplateAfter from '$lib/assets/template_after.png';
	import TemplateBefore from '$lib/assets/template_before.png';
	import BackButton from '$lib/components/back-button.svelte';
	import HeaderPage from '$lib/components/header-page.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Spinner } from '$lib/components/ui/spinner';
	import * as Table from '$lib/components/ui/table';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { web_path_header } from '$lib/store/webDesignStore';
	import { Download, Info, Upload } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

    let { templateExists } = $derived(data)

    $effect(()=>{
        console.log({templateExists})
    })

	$web_path_header = [
		{ path_name: 'Admin', route: '/admin/dashboard' },
		{ path_name: 'Settings', route: '/admin/settings' },
		{ path_name: 'Template', route: '/admin/settings/template' }
	];

    let uploadSubmitState = $state(false)
    let uploadSubmitError = $state<string | undefined>()

    const templatePlaceholders = [
  {
    "name": "Name",
    "placeholder": "{name}",
    "description": "Employee’s full name"
  },
  {
    "name": "Position / Department",
    "placeholder": "{positionDepartment}",
    "description": "Job title and department"
  },
  {
    "name": "Date Filed",
    "placeholder": "{dateFiled}",
    "description": "Date the leave was filed"
  },
  {
    "name": "Type of Leave",
    "placeholder": "{selectLeave}",
    "description": "Vacation Leave or Sick Leave"
  },
  {
    "name": "Other Leave",
    "placeholder": "{otherLeave}",
    "description": "Specify leave type if 'Other' is selected"
  },
  {
    "name": "Leave Start Date",
    "placeholder": "{leaveStart}",
    "description": "Start date of the leave"
  },
  {
    "name": "Leave End Date",
    "placeholder": "{leaveEnd}",
    "description": "End date of the leave"
  },
  {
    "name": "Total Number of Days",
    "placeholder": "{totalDays}",
    "description": "Total duration of the leave"
  },
  {
    "name": "Contact Number",
    "placeholder": "{contactNumber}",
    "description": "Contact number during leave period"
  },
  {
    "name": "Reason for Leave",
    "placeholder": "{reasonForLeave}",
    "description": "Explanation for the leave request"
  },
  {
    "name": "Employee Name (Capitalized)",
    "placeholder": "{fullNameCapital}",
    "description": "Printed name for employee signature"
  },
  {
    "name": "Department Head Name (Capitalized)",
    "placeholder": "{deptHeadFullNameCapital}",
    "description": "Printed name for department head signature"
  },
  {
    "name": "HR / Manager Name (Capitalized)",
    "placeholder": "{hrFullNameCapital}",
    "description": "Printed name for HR or manager approval"
  }
]

</script>

<BackButton route={"/admin/settings"} />

<HeaderPage
	title={'Template'}
	message={'Upload or update the leave request form template used by the system.'}
/>

<div class="mt-10 grid gap-10 px-4 lg:px-6">
	<Card.Root>
		<Card.Header>
			<Card.Title>Download Template</Card.Title>
		</Card.Header>
		<Card.Content>
            {#if !templateExists}
                <p class="text-sm text-red-500 mb-2">Template file not found. Please upload a template.</p>
            {/if}
            <Button href="/api/download-template" disabled={!templateExists}><Download /> Download Template</Button>
		</Card.Content>
	</Card.Root>

<Card.Root>
    <Card.Header>
        <Card.Title>Update Template</Card.Title>
    </Card.Header>

    <form 
        action="?/upload_template" 
        id="form_upload" 
        method="post" 
        enctype="multipart/form-data"
        use:enhance={()=>{

            uploadSubmitState = true

            return async ({result, update}) => {
                console.log({result})
                
                if(result.type === 'failure'){
                    const data = result.data as { message?: string}
                    uploadSubmitError = data?.message || 'An error occurred';
                }

                if(result.type === 'success'){
                    uploadSubmitError = undefined

                    const data = result.data as { message?: string}
                    toast.success(data?.message || 'Upload successfully')
                }

            uploadSubmitState = false
            await update()
            }
        }}
    >
        <Card.Content>
            <div class="grid w-full max-w-sm items-center gap-1.5">
                <Label for="docx">
                    Template File 
                    <Tooltip.Provider>
                        <Tooltip.Root>
                            <Tooltip.Trigger class="inline-flex items-center">
                                <Info class="size-4 text-muted-foreground hover:text-foreground" />
                            </Tooltip.Trigger>

                            <Tooltip.Content
                                class="max-w-xs rounded-md bg-popover px-3 py-2 text-sm text-popover-foreground shadow-md"
                                side="top"
                                sideOffset={6}
                            >
                                <p>File name must be "template.docx"</p>
                            </Tooltip.Content>
                        </Tooltip.Root>
                    </Tooltip.Provider>
                </Label>
                <Input 
                    name="templateFile" 
                    id="docx" 
                    type="file" 
                    accept=".docx" 
                    form="form_upload"
                    required
                />
            </div>
            
            {#if uploadSubmitError}
                <p class="text-sm text-red-600 my-2">{uploadSubmitError}</p>
            {/if}
            
        </Card.Content>
        <Card.Footer class="mt-5">
            <Button form="form_upload" type="submit" disabled={uploadSubmitState}>
                {#if uploadSubmitState}
                    <Spinner />
                   {:else} 
                   <Upload /> 
                {/if}
                Upload Template
            </Button>
        </Card.Footer>
    </form>
</Card.Root>

    <Card.Root>
		<Card.Header>
			<Card.Title>How to make a Template File</Card.Title>
		</Card.Header>
		<Card.Content>
            <Table.Root>
              <Table.Caption>A list of placeholder that needs in the template file.</Table.Caption>
              <Table.Header>
                <Table.Row>
                  <Table.Head>Name</Table.Head>
                  <Table.Head>Placeholder</Table.Head>
                  <Table.Head>Description</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
              {#each templatePlaceholders as item}
                 <Table.Row>
                    <Table.Cell>{item.name}</Table.Cell>
                    <Table.Cell>{item.placeholder}</Table.Cell>
                    <Table.Cell>{item.description}</Table.Cell>
                </Table.Row>
                {/each}
            </Table.Body>
            </Table.Root>

            <div class='grid gap-5 mt-5 [&_div>p]:text-xl [&_div>p]:font-bold [&_div>img]:w-[50%]'>
                <div class='grid gap-1'>
                    <p>Template Before adding Placeholders</p>
                    <img src={TemplateBefore} alt="template before">
                </div>
                <div class='grid gap-1'>
                    <p>Template After adding Placeholders</p>
                    <img src={TemplateAfter} alt="template after">
                </div>
            </div>


		</Card.Content>
	</Card.Root>
</div>
