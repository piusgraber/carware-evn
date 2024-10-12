<script lang="ts">
	import { lead } from '$lib/lead.svelte';

	let {
		title, // Titel
		lang, // Sprache (de, fr, it)
		adresse = $bindable(), // die Adresse
		plzValid = false, // Flag zur Kennzeichnung ungültige PLZ
		adrValid = $bindable()
	} = $props(); // Adresse ist gültig

	const anreden = [
		{ id: '', value: '--' },
		{ id: 1, value: texte.herr[lang] },
		{ id: 2, value: texte.frau[lang] },
		{ id: 3, value: texte.firma[lang] }
	];

//	const rawLead = lead.lead;
	import { texte } from '$lib/texte';


	const prod = true;
	let ort = $state('');

	let plzIsValid = $state(true);
	const anredeValid = $derived(!!adresse.anredeid);
	const nameValid = $derived(!!(adresse.name?.length >= 5));
	const adresseValid = $derived(!!(adresse.adresse?.length > 3));
	const ortValid = $derived(!!(adresse.ort?.length > 1));
	$effect(() => {
		plzIsValid = adresse.plz?.length == 4 && plzValid;
	});
	$effect(() => {
		adrValid = anredeValid && ortValid && adresseValid && nameValid && plzFormatValid && plzValid;
		$inspect('adrValid', adrValid)
		//		adrValid = adrValid && adresse.name;
		//adrValid = adrValid && adresse.adresse;
		//adrValid = adrValid && adresse.plz.length >= 4;
		//adrValid = adrValid && ortValid
		//		console.log('ortValid', ortValid)
	});

	$effect(()=>{
		adresse.anrede = adresse.anredeid ? anreden[adresse.anredeid].value : '??'
	})

	// Prüfen ob das Format ok ist
	let plzFormatValid = $derived(!!(adresse.plz?.length == 4));
	/*
	 */
</script>
<adr>

<div class:adr={adrValid} class:invalid={!adrValid}>


<div class="gridevn2">
	<div class="span-div" ><u>{title}</u></div>
	<div>{texte.anrede[lang]}</div>

	<div>
		<select bind:value={adresse.anredeid} class:invalid={!anredeValid}>
			{#each anreden as art}
				<option value={art.id}>{art.value}</option>
			{/each}
		</select>
	</div>
	<div>{texte.name[lang]}</div>
	<div>
		<input class:invalid={!nameValid} class="adresse" bind:value={adresse.name} required="true" />
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
		<input class:invalid={!plzValid} class="plz" bind:value={adresse.plz} />
		<input class:invalid={!ortValid} bind:value={adresse.ort} />
	</div>
</div>
</div>
</adr>

<!--
{JSON.stringify(adresse)}
-->
<style>
	adr, * {
		font-family: Arial, Helvetica, sans-serif;
		font-size: 1rem;
	}
	div {
		line-height: 1.5rem;
	}
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

	div.invalid {
		background-color: #98a3ff;
	}
	div.adr {
		background-color: #98ffba;
	}

	.gridevn2 {
		display: grid;
		grid-template-columns: 260px 320px;
		grid-auto-rows: auto;
		grid-column-gap: 0px;
		grid-row-gap: 0px;
	}
	.span-div {
    grid-column: span 2; /* This makes the div span across 2 columns */
  }
	.plz {
		width: 60px;
	}
	.adresse {
		width: 260px;
	}
</style>
