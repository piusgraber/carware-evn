<script lang="ts">
    import {lead} from "$lib/lead.svelte"
	import { trusted } from "svelte/legacy";
	import Adresse from "./Adresse.svelte";
	import Comp from "./Comp.svelte";
    let {data}=$props()
    lead.set(data)
    const rawLead = lead.lead

    const checkPlzL = async (kanton, plz) => {
		console.log(kanton, plz);
		if (plz && kanton) {
			try {
				let d = await fetch(baseUrlS + 'plzOrt?plz=' + plz + '&kanton=' + kanton + '');
				let p = await d.json();
				console.log(p);
				if (p.length) {
				}
				return (p.length > 0);
			} catch (err) {
				return false;
			}
		} else {
			return false;
		}
	};


    let halterPlzValid = $state(true)
    let standortPlzValid = $state(true)

    $effect (()=>{
        $inspect('hhhhhhhhhhhhhhh')
        rawLead.halteranredeid = rawLead.halter.anredeid
        rawLead.haltername = rawLead.halter.name
        rawLead.halteradresse = rawLead.halter.adresse
        rawLead.halterplz = rawLead.halter.plz
        rawLead.halterort = rawLead.halter.ort
        rawLead.standortanredeid = rawLead.standort.anredeid
        rawLead.standortname = rawLead.standort.name
        rawLead.standortadresse = rawLead.standort.adresse
        rawLead.standortplz = rawLead.standort.plz
        rawLead.standortort = rawLead.standort.ort
    })
    $effect(() => {
		// Define an inner async function
		const runCheck = async () => {
            console.log('uuuuuuuuuuuuuuuuuuuuuuuuuuu')
            halterPlzValid = await checkPlzL(rawLead.kanton, rawLead.halterplz);
            if (halterPlzValid) {
                rawLead.standort = {anredeid: 1}
            }
			}
		
		runCheck();
	});

    $effect(() => {
		// Define an inner async function
		const runCheck = async () => {
            console.log('uuuuuuuuuuuuuuuuuuuuuuuuuuu')
            standortPlzValid = await checkPlzL(rawLead.kanton, rawLead.standort.plz);
			}
		
		runCheck();
	});

    // Call an async function from inside the reactive block

 


    const prod = trusted
	const baseUrlS = prod ? 'https://api.car-ware.ch/' : 'http://127.0.0.1:3344/';


</script>

{JSON.stringify(rawLead)}
<Adresse plzValid={true} title='Halter' lang='it', adresse={rawLead.halter}></Adresse>
{#if !halterPlzValid}
<Adresse plzValid={standortPlzValid} title='Standort' lang='it', adresse={rawLead.standort}></Adresse>
{/if}