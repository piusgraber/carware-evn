<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	let { showMail=$bindable(false), status = 2 } = $props();
	import { localTime } from '$lib/dateFuncs';

	import { lead } from '$lib/lead.svelte';
	import { texte } from '$lib/texte';
	let rawLead = $state(lead.lead);

	let beststatus = $state('beststatusX');

	function replaceTokens(oldstring, ld) {
		return oldstring.replace(/%\(([^)]+)\)/g, function (match, p1) {
			return ld[p1] || '';
		});
	}

	const oldstring = 'Hi %(dispo_email) you are a %(b)';
	const ld = { a: 'Peter', b: 'teacher', c: 'xxx' };
	const newString = replaceTokens(oldstring, rawLead);
	console.log(newString);

	$effect(() => {
		beststatus = 'beststatus' + status;
	});


    const redo = () => {
        rawLead.evnsent=null
        invalidateAll()
    }

	const toggleShowMail = () => {
	showMail = !showMail
}

</script>
<div class="evn">
	<div class="r14 headline">{texte.headlinestatus1[rawLead.sprache]}</div>
</div>
<div>&#160;</div>

<div class="gridstatus">
	<div class="status">{texte.bestangaben[rawLead.sprache]}</div>
	<div class="status"></div>
	<div class="status"></div>
	<div class="status"></div>

	<div class="status">{texte.bestdatum[rawLead.sprache]}</div>
	<div class="status"><b>{localTime(rawLead.evnsent).substring(0, 10)}</b></div>
	<div class="status">{texte.bestzeit[rawLead.sprache]}</div>
	<div class="status"><b>{localTime(rawLead.evnsent).substring(11, 16)} {texte.bestzeitUhr[rawLead.sprache]}</b></div>
	<div class="status">{texte.bestempf[rawLead.sprache]}</div>
	<div class="status"><b>{rawLead.versicherung}</b></div>
	<div class="status">{texte.bestPDF[rawLead.sprache]}</div>
	<div class="status">
        <a href="https://lead.car-ware.ch/fop/ngDok?type=nachweis&amp;id=181222&guid={rawLead.guid}" target="dok"><img style="cursor:pointer; height: 30px" src="images/PDFKlick.png" alt="evn-logo" />
        </a></div>
</div>

<div class="gridstatus2">
	<div class="infobody">
		<button class:evnstatuswaiting={status == 1} class:evnstatusgood={status == 2}>
			{texte.beststatus[rawLead.sprache]}</button
		>
		<span class:waiting={status == 1} class:good={status == 2}>
			<b>{texte[beststatus][rawLead.sprache]}</b>
		</span>
		{#if status == 2}
        <span class="status">
        &#160;&#160;&#160;&#160;&#160;&#160;{texte.bestantwort[rawLead.sprache]}
			<img on:click={toggleShowMail} style="cursor:pointer; height: 40px" src="images/BildMailKlick.png" alt="evn-logo" />
            </span>
		{/if}
	</div>
    <div>&#160;</div>

	<div class="infobody">
		<u>{texte.statusgueltig1[rawLead.sprache]}</u><br/>
		{@html texte.statusgueltig2[rawLead.sprache]}
	</div>

	<div class="infotop">
		<u>{texte.statusverarbeit1[rawLead.sprache]}</u><br/>
		{texte.statusverarbeit2a[rawLead.sprache]}
		<span class="bluefat">{rawLead.dispo_email}</span>
		{texte.statusverarbeit2b[rawLead.sprache]}
		<span class="bluefat">{rawLead.versicherung}</span>
		{texte.statusverarbeit2c[rawLead.sprache]}
		<span class="bluefat">{rawLead.evntelefon}</span>
		{texte.statusverarbeit2d[rawLead.sprache]}
	</div>

	<div class="infotop">
		<u>{texte.statusvvb1[rawLead.sprache]}</u><br/>
		{texte.statusvvb2[rawLead.sprache]}

        <a href="https://lead.car-ware.ch/pavServer/ngDok?type=vvb&guid={rawLead.guid}" target="dok">
		<img style="cursor:pointer; height: 40px" src="images/PDFKlick.png" alt="evn-logo" />
        </a><br/>
		{texte.statusvvb3[rawLead.sprache]}
	</div>

	<div class="infotop">
		<u>{texte.statusneu1[rawLead.sprache]}</u><br/>
		{texte.statusneu2[rawLead.sprache]}
	</div>
	<div>
		<button class="submitsmall" on:click={redo}> {texte.statusneu3[rawLead.sprache]}</button>
	</div>
</div>

<style>
	.r14 {
		grid-column: 1 / span 4;
	}
	.waiting {
        padding-left: 20px;
		color: red;
	}
	.good {
        padding-left: 20px;
		color: green;
	}

    .bluefat {
        color: #277FE8;
        font-weight: bold;
    }
</style>
