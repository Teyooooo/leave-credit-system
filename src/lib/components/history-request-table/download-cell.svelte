<script lang="ts">

    import Button from '$lib/components/ui/button/button.svelte';
    import type { LeaveHistory } from '$lib/types/data';
    import { convertTimestamp } from '$lib/utils/helper';
    import { Download } from '@lucide/svelte';
    
    let { data }: { data: LeaveHistory } = $props();

    async function generateLeaveForm(){
        console.log('generating leave form')

        const response = await fetch('/api/generate-document', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data }),
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('Failed to generate document:', error);
            return;
        }

        // Convert response to blob
        const blob = await response.blob();

        // Create a temporary URL for the blob
        const url = URL.createObjectURL(blob);

        // Create a File name format
        const applicantName = String(data.employee_name).toLowerCase().split(' ').join('-')
        const dateFiled = convertTimestamp(data.date_filed, 'date').toLowerCase().replace(/,/g, '').replace(/\s+/g, '-')
        const fileName = `leave-form-${applicantName}-${dateFiled}.docx`

        // Create a hidden anchor and trigger download
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();

        // Cleanup
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

</script>


    <Button
        variant='outline'
        class="cursor-pointer"
        disabled={data.status === 'Decline'}
        onclick={generateLeaveForm}
    >
        <Download /> Download
    </Button>
