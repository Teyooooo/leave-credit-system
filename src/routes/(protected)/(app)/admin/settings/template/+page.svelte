<script lang="ts">
	import { enhance } from '$app/forms';
	import BackButton from '$lib/components/back-button.svelte';
	import HeaderPage from '$lib/components/header-page.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
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
            <Button form="form_upload" type="submit">
                <Upload /> Upload Template
            </Button>
        </Card.Footer>
    </form>
</Card.Root>

    <Card.Root>
		<Card.Header>
			<Card.Title>How to make a Template File</Card.Title>
		</Card.Header>
		<Card.Content>
            <p class="text-muted-foreground">To be added...</p>
		</Card.Content>
	</Card.Root>
</div>
