<script lang="ts">

import {lead } from '$lib/lead.svelte'
	
let {adresse=$bindable(), lang, title, plzValid=true, adrValid=$bindable()}=$props()

const rawLead = lead.lead
	import { texte } from '$lib/texte.js';

	const anreden = [
		{ id: '', value: '--' },
		{ id: 1, value: texte.herr[lang] },
		{ id: 2, value: texte.frau[lang] },
		{ id: 3, value: texte.firma[lang] }
	];

	const prod = true;
	let ort = $state('');

	const anredeValid = $derived(!!adresse.anredeid)
	const nameValid  = $derived(!!(adresse.name?.length > 5))
	const adresseValid = $derived(!!(adresse.adresse?.length > 3 ))
	const ortValid  = $derived(!!(adresse.ort?.length > 1 ))
	$effect(() => {

		adrValid =  anredeValid && ortValid && nameValid && plzFormatValid;
//		adrValid = adrValid && adresse.name;
		//adrValid = adrValid && adresse.adresse;
		//adrValid = adrValid && adresse.plz.length >= 4;
		//adrValid = adrValid && ortValid
		console.log('ortValid', ortValid)
		}
	)
	let plzKantonValid = $state(false);

	// Prüfen ob das Format ok ist
	let plzFormatValid = $derived(!!(adresse.plz?.length == 4));
/*
*/



	</script>

<div></div>
({adrValid})({plzKantonValid})[{plzValid}]
!!!{rawLead.halteranredeid}
<!--
    {JSON.stringify(adresse)}
{adrValid}x{plzValid}:{invalidPlz}
-->

<div class="gridevn2">
	<div>{title} </div>
	<div></div>
	<div>{texte.anrede[lang]}</div>
	
	<div>
		<select bind:value={adresse.anredeid}
		class:invalid = {!anredeValid}>
			{#each anreden as art}
				<option value={art.id}>{art.value}</option>
			{/each}
		</select>{!!adresse.anredeid}
	</div>
	<div>{texte.name[lang]}</div>
	<div>
		<input
			class:invalid={!nameValid}
			class="adresse"
			bind:value={adresse.name}
			required="true"
		/>
	</div>
	<div>{texte.adresse[lang]}</div>
	<div>
		<input
			class:invalid={!adresseValid}
			class="adresse"
			bind:value={adresse.adresse}
			required="true"
		/>
	</div>
	<div>{texte.plzort[lang]}</div>
	<div>
		<input
			class:invalid={!plzFormatValid || !plzValid}
			class="plz"
			bind:value={adresse.plz}
		/>{plzKantonValid}
		<input class:invalid={adresse.ort?.length < 2 || false} bind:value={adresse.ort} />
	</div>
</div>

<!--
{JSON.stringify(adresse)}
-->
<style>
	select,
	input,
	input {
		border: 1pt solid rgb(99, 99, 99);
	}

	select.invalid,
	input.invalid {
		background-color: #98a3ff;
		border: 1pt solid rgb(99, 99, 99);
	}


	.gridevn2 {
		display: grid;
		grid-template-columns: 220px 320px;
		grid-auto-rows: auto;
		grid-column-gap: 0px;
		grid-row-gap: 0px;
	}
	.plz {
		width: 60px;
	}
	.adresse {
		width: 260px;
	}
</style>
