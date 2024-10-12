<script lang="ts">
    import {lead} from '$lib/lead.svelte'
    const adresse = lead.lead
</script>

<input type="text" bind:value={adresse.halter.name}>