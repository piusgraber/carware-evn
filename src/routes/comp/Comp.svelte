<script lang="ts">
    let  {data=$bindable(), valid=true, plzValid = false} = $props();
     
</script>

Name: <input type="text" bind:value={data.name} />y<br/>
PLZ: <input class:invalid={!plzValid} type="text" bind:value={data.plz} />

<style>
    .invalid  {
        background-color: red;
    }
</style>