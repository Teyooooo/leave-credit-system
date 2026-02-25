<script lang="ts">
	import { enhance } from "$app/forms";
	import { Button, buttonVariants } from "$lib/components/ui/button";
	import * as Dialog from "$lib/components/ui/dialog";
	import { Spinner } from "$lib/components/ui/spinner";
	import type { AnnouncementInfo } from "$lib/types/data";
	import { convertTimestamp } from "$lib/utils/helper";
	import { Trash } from "@lucide/svelte";
	import { toast } from "svelte-sonner";

    let { item } : { item: AnnouncementInfo} = $props()

    let borderColor = $derived.by(()=>{
        const formattedType = item?.type?.toLocaleLowerCase()

        switch (formattedType) {
            case 'active':
                return 'border-green-300'
            case 'upcoming':
                return 'border-yellow-300'
            case 'expired':
                return 'border-red-300'
            default:
                return 'border-slate-300'
        }
    })

    let dialogState = $state(false)
    let submitState = $state(false)
    let errorState = $state<string | undefined>()

</script>

<div class="flex gap-2 border-y py-2">
    <div class="flex flex-col gap-1 pt-2 pe-5 me-3 border-e-10 {borderColor} w-36">
        <span>
            {convertTimestamp(item.valid_until_start, 'date')}
        </span>
        <span>
            {convertTimestamp(item.valid_until_end,'date')}
        </span>
    </div>
    <div class="grid gap-2 w-full">
        <div class="w-full flex justify-between items-end">
            <p class="text-xl font-bold">{item.title}</p>
            <Button variant='destructive' onclick={()=>{ dialogState = true}}>
                <Trash/>
            </Button>
        </div>
        <div class="font-light">{item.details}</div>
        <div class="w-full text-end text-muted-foreground">Created at: {convertTimestamp(item.created_at, 'full')}</div>
    </div>
</div>

<Dialog.Root open={ dialogState || false }
    onOpenChange={open => {
        dialogState = open

        if(!open){
            errorState = undefined
        }
    }}
>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Delete Announcement ({item.title})</Dialog.Title>
      <Dialog.Description>
        This action cannot be undone. This will permanently delete this announcement from our servers.
      </Dialog.Description>
    </Dialog.Header>
    {#if errorState}
        <p class="text-sm text-red-600">{errorState}</p>
    {/if}
    <Dialog.Footer>
        <Dialog.Close class={buttonVariants({ variant: 'outline' })}>Cancel</Dialog.Close>
        <form action="?/remove_announcement" method="post" id="remove_announcement_{item.uuid}" use:enhance={
            ({formData})=>{

                submitState = true

                formData.append('uuid', item.uuid);
                formData.append('title', item.title);

                return async ({result, update}) => {
                    submitState = false
                    console.log({result})

                    if(result.type === 'failure'){
                        const data = result?.data as { message?: string}
                        errorState = data?.message ?? "An error occurred"
                    }

                    if(result.type === 'success'){
                        errorState = undefined
                        dialogState = false
                        toast.success('Announcement removed successfully')
                    }

                    await update()

                }
            }
        }>
            <Button type="submit" variant="destructive" form="remove_announcement_{item.uuid}" disabled={submitState}>
                {#if submitState}
                    <Spinner />
                {/if}
                Remove</Button
            >
        </form>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>