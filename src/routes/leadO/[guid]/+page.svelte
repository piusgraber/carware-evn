<script lang="ts">
    	import { texte } from '$lib/texte';

	import { lead } from '$lib/lead.svelte';
	import Adresse from './Adresse.svelte';
	import Evn from './Evn.svelte';
	let { data } = $props();
    data.sprache = data.garage_spracheid==2 ? 'fr' : data.garage_spracheid==3 ? 'it' : 'de'
	lead.set(data);
	const rawLead = lead.lead;
	let halterValid = $state(true);
	let standortValid = $state(true);
	let evnValid = $state(true);
	// Prüfung der PLZ mit Ort

	const checkPlzL = async (kanton, plz) => {
		console.log(kanton, plz);
		if (plz && kanton) {
			try {
				let d = await fetch(baseUrlS + 'plzOrt?plz=' + plz + '&kanton=' + kanton + '');
				let p = await d.json();
				console.log(p);
				if (p.length) {
				}
				return p.length > 0;
			} catch (err) {
				return false;
			}
		} else {
			return false;
		}
	};

	// ist die Halte-PLZ mit Kanton übereinstimmend
	let needsStandort = $state(true);
	// gültige PLZ
	let halterPlzValid = $state(true);

	// ist die Standort-PLZ mit Kanton übereinstimmend
	let standortPlzValid = $state(true);

	$effect(() => {
		evnValid = halterValid && (!needsStandort || (needsStandort && standortValid));
	});
	$effect(() => {
		console.log('ooooooooooooo');
		rawLead.halteranredeid = rawLead.halter.anredeid;
		rawLead.halteranrede = rawLead.halter.anrede;
		rawLead.haltername = rawLead.halter.name;
		rawLead.halteradresse = rawLead.halter.adresse;
		rawLead.halterplz = rawLead.halter.plz;
		rawLead.halterort = rawLead.halter.ort;

		rawLead.standortanredeid = rawLead.standort.anredeid;
		rawLead.standortname = rawLead.standort.name;
		rawLead.standortadresse = rawLead.standort.adresse;
		rawLead.standortplz = rawLead.standort.plz;
		rawLead.standortort = rawLead.standort.ort;
	});

	$effect(() => {
		const runCheck = async () => {
			needsStandort = false;
			if (rawLead.halterplz.length == 4) {
				const kantonPlzValid = await checkPlzL(rawLead.kanton, rawLead.halterplz);
				if (kantonPlzValid) {
					// Standort zurücksetzen
//					rawLead.standort = { anredeid: 0 };
				} else {
					needsStandort = true;
				}
				halterPlzValid = true;
			} else {
				halterPlzValid = false;
				needsStandort = false;
			}
		};
		// Halter PLZ prüfen
		runCheck();
	});

	$effect(() => {
		// Define an inner async function
		const runCheck = async () => {
			standortPlzValid = await checkPlzL(rawLead.kanton, rawLead.standort.plz);
		};
		// Standort PLZ prüfen
		runCheck();
        $inspect('plzvalid', standortPlzValid)
	});

	// Call an async function from inside the reactive block

	const prod = true;
	const baseUrlS = prod ? 'https://api.car-ware.ch/' : 'http://127.0.0.1:3344/';
</script>

<div class:invalid={!evnValid}>
    <div>&#160;</div>

{#if false}    
    <div class="grid">
        <div>


	<!--   PLZ immer gültig markieren  -->
	<Adresse
		plzValid={halterPlzValid}
		title={texte.halter[rawLead.sprache]}
		lang={rawLead.sprache}
		adresse={rawLead.halter}
		bind:adrValid={halterValid}
	></Adresse>
</div>
<div>

	{#if needsStandort}
		<!--   PLZ gültig markieren, wenn Kanton/PLZ übereinstimmen  -->
		<Adresse
			plzValid={standortPlzValid}
            title={texte.standort[rawLead.sprache]}
			lang={rawLead.sprache}
			adresse={rawLead.standort}
			bind:adrValid={standortValid}
		></Adresse>
	{/if}
</div>

    </div>
    {/if}
	evnValid: {evnValid}<br/>
    halterValid: {halterValid}
</div>
<Evn rawLead={rawLead} ></Evn>

<style>
    .grid {
        display: grid;
        grid-template-columns: 590px 590px;
    }
	div.invalid {
		background-color: #ff98fa;
	}
</style>
<hr/>
{JSON.stringify(rawLead)}
<hr/>