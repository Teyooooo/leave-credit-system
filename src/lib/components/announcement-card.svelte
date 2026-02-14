<script lang="ts">
	import { convertTimestamp } from "$lib/utils/helper";
	import type { AnnouncementInfo } from "$lib/types/data";

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
        <div class="text-xl font-bold">{item.title}</div>
        <div class="font-light">{item.details}</div>
        <div class="w-full text-end text-muted-foreground">Created at: {convertTimestamp(item.created_at, 'full')}</div>
    </div>
</div>