<script>
	import Adresse from './Adresse.svelte';
	import Fahrzeug from './Fahrzeug.svelte';
	import { texte } from '$lib/texte.js';
	import { lead } from '$lib/lead.svelte';
	let rawLead = $state(lead.lead);

    
    let {xrawLead = $bindable({ }),
	lang = 'it',
	sent,
	redoEvn,
	demo,
    btnClicked = false,
    evnValid = false}
    = $props();

	const prod = true;
	const baseUrlS = prod ? 'https://api.car-ware.ch/' : 'http://127.0.0.1:3344/';
	const baseUrlL = prod
		? 'https://lead.car-ware.ch/pavServer/'
		: 'http://127.0.0.1:8080/api/pavServer/';

	let disponenten = $state([]);

	const fetchDisponenten = async () => {
		const url=baseUrlS + 'disponentEVN'
		console.log('disponentenUrl', url)
        let p = await fetch(url)
        disponenten = await p.json();
		console.log('disponenten', disponenten)
		disponenten = disponenten.filter((d) => !d.hidden);
		disponenten.map((d) => (d.bezeichnung = d.vorname + ' ' + d.nachname));
		disponenten = [...disponenten]
	};
	fetchDisponenten();
	console.log('xxxxxxxxxxxxxxxxxxxxxxxxxx')

	let nationalitaeten = $state([]);


	$effect(() => {
		const getNationen = async () => {
		const unkN = {
			itemid: 0,
			codeid: 99,
			code: '--',
			sort: 1,
			bezeichnung: 'unbekannt'
		};
		nationalitaeten = [unkN];
        try {
            let d = await fetch("https://api.car-ware.ch/nation");
            let p = d.json();
            p.then((d) => {
            nationalitaeten = [unkN, ...d];
            });
        } catch (err) {
//            alert(err); // Failed to fetch
        }
	};
	 getNationen();
	$inspect('nationen', nationalitaeten)
	})
/*
	$: {
		if (!rawLead.anredeid_so) rawLead.anredeid_so = '';
		if (!rawLead.vorname_so) rawLead.vorname_so = '';
		if (!rawLead.nachname_so) rawLead.nachname_so = '';
	}
*/
	let savedKanton = '';
	let savedPLZ = '';
	let savedPLZSO = '';

	const setNew = () => {
		rawLead.kennzeichen = texte.neu[lang];
	};
/*
    $: fahrzeug = {
		marke: rawLead.marke,
		typ: rawLead.typ,
		modell: rawLead.modell
	};
*/
	let matchPlz = false;
	let kontakt = {};

	let fzValid = false;
	let adrValid = false;
	let sadrValid = false;
//	let evnValid = false;
	let dataChecked = false;
	let stAdr = false;

	let plok = true;
	const setPlok = () => {
		plok = false;
		setTimeout(() => {
			plok = true;
		}, 200);
	};

	const toggleHalterCheck = () => {
		dataChecked = !dataChecked;
	};
	const checkFormsValid = (rec) => {
		let isValid = true;
		if (rawLead) {
			isValid = isValid && (rec.nationalitaet || (rawLead.halter && rawLead.halter.anredeid == 3));
			isValid =
				isValid &&
				(rec.geburtstag ||
					(rawLead.halter && rawLead.halter.anredeid == 3) ||
					rawLead.geburtstagunbekannt);
			isValid = isValid && rec.user_telefon.length >= 10;
			if (rawLead.garage_idkey == 'AUTOKUNZ') {
				isValid = isValid && disponentid != '';
			}
		}
		return isValid;
	};

	let invalidTel = $derived(!rawLead || !rawLead.user_telefon || rawLead.user_telefon.length < 10);

	let invalidKTel = $derived(!kontakt.telefon || kontakt.telefon.length < 10);

	let sendMessage = null;
	const saveEVN = async () => {
		btnClicked = true;
		//        rawLead.standort = standort;
		rawLead.redo = redoEvn;
		let jsonRawLead = JSON.stringify(rawLead);
		jsonRawLead = jsonRawLead.replace("'", '´');
		console.log(jsonRawLead);
		// request options
		const options = {
			method: 'POST',
			body: jsonRawLead,
			headers: {
				'Content-Type': 'application/json'
			}
		};
		const options2 = {
			headers: {
				'Content-Type': 'application/json'
			}
		};
		try {
			console.log(options);
			const fetchResponse = await fetch(baseUrlS + 'saveEVN', options);
			const data = await fetchResponse.json();
			console.log(data);
			if (data.error) {
				sendMessage = JSON.stringify(data.error);
				sent = true;
			} else {
				const fetchResponse2 = await fetch(
					baseUrlL + 'ngSendEVN.json?irenehassuchasmile&id=' + rawLead.id,
					//                "http://127.0.0.1:8080/api/pavServer/ngSendEVN.json?irenehassuchasmile&id=" + rawLead.id,
					options2
				);
				const data2 = await fetchResponse2.json();
				console.log(data2); //200
				if (data.error) {
					sendMessage = JSON.stringify(data.error);
				}
				sent = true;
			}
		} catch (err) {
			console.log(err);
		}
	};

	let kontaktEdit = false;

	const getKontakt = async () => {
		return {};
		/*
        try {
            const options = {
                method: "GET",
            };

            const fetchResponse = await fetch(
                baseUrlS + "getKontakt?user_email=" + rawLead.user_email + "",
                options
            );
            const data = await fetchResponse.json();
            console.log(data); //200
            return (data);
        } catch (err) {
            console.log(err);
        }
*/
	};
	const doEditKontakt = () => {
		kontaktEdit = true;
	};

	const doSaveKontakt = async () => {
		if (invalidKTel) return;
		kontaktEdit = false;
		if (!kontaktEdit) {
			kontakt.user_email = rawLead.user_email;
			let jsonKontakt = JSON.stringify(kontakt);
			jsonKontakt = jsonKontakt.replace("'", '´');
			const options = {
				method: 'POST',
				body: jsonKontakt,
				headers: {
					'Content-Type': 'application/json'
				}
			};
			try {
				const fetchResponse = await fetch(baseUrlS + 'saveKontakt', options);
				const data = await fetchResponse.json();
				console.log(data); //200
				kontakt.done = false;
				if (data.error) {
					sendMessage = JSON.stringify(data.error);
				}
			} catch (err) {
				console.log(err);
			}
		}
	};

	const anreden = [
		{ id: '', value: '--' },
		{ id: 1, value: texte.herr[lang] },
		{ id: 2, value: texte.frau[lang] },
		{ id: 3, value: texte.firma[lang] }
	];

	$effect (() => {
        $inspect('effect1')
		if (rawLead.id && !kontakt.done) {
			kontakt.done = true;
			if (rawLead.garage_idkey != 'AUTOKUNZ') {
				getKontakt().then((data) => {
					if (data.id) {
						kontakt = data;
						rawLead.garage_firma = data.firma;
						rawLead.user_anredeid = data.anredeid;
						rawLead.user_vorname = data.vorname;
						rawLead.user_nachname = data.nachname;
						rawLead.user_telefon = data.telefon;
						rawLead.dispo_email = data.email;
					} else {
						kontakt = {
							firma: rawLead.garage_firma,
							anredeid: rawLead.user_anredeid,
							vorname: rawLead.user_vorname,
							nachname: rawLead.user_nachname,
							telefon: rawLead.user_telefon,
							email: rawLead.user_email
						};
					}
					kontakt.done = true;
				});
			}
		}
	}
)

	import { styles } from '$lib/css_store.js';

	let brandSrc2 = $derived($styles.brandSrc2);
	let disponentid = '';
	$effect(()=> {
        $inspect('effect3')
		if (disponentid) {
			let dsp = disponenten.filter((d) => d.id == disponentid);
			let dspn = dsp[0];
			kontakt.email = dspn.email;
			kontakt.anredeid = dspn.anredeid;
			kontakt.nachname = dspn.nachname;
			kontakt.vorname = dspn.vorname;
			kontakt.telefon = dspn.telefon;
			rawLead.user_email = dspn.email;
			rawLead.user_anredeid = dspn.anredeid;
			rawLead.user_nachname = dspn.nachname;
			rawLead.user_vorname = dspn.vorname;
			rawLead.user_telefon = dspn.telefon;
			kontaktEdit = false;
		} else {
			//            kontaktEdit = rawLead.garage_idkey == 'AUTOKUNZ';
		}
	})
	$effect(() => {
        $inspect('effect4')
		if (rawLead.geburtstagunbekannt) {
			rawLead.geburtstag = null;
		}
	})





    let halterValid = $state(false)


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
	let standortValid = $state(true);
    	let halterPlzValid = $state(false);

	// ist die Standort-PLZ mit Kanton übereinstimmend
	let standortPlzValid = $state(false);

	$effect(() => {
        $inspect('effect0')
		if (rawLead.garage_idkey == 'AUTOKUNZ') {
			if (disponentid == '') {
				evnValid = false;
			}
		} else {
            evnValid = halterValid && (!needsStandort || (needsStandort && standortValid));
        }
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
        $inspect('effect01')
		const runCheck = async () => {
            console.log("ssss")
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
        $inspect('effect02')
		// Define an inner async function
		const runCheck = async () => {
			standortPlzValid = await checkPlzL(rawLead.kanton, rawLead.standort.plz);
		};
		// Standort PLZ prüfen
		runCheck();
        $inspect('plzvalid', standortPlzValid)
	});

	// Call an async function from inside the reactive block


</script>
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

<div class="evn">
	<div class="r14">
		<Fahrzeug {lang} bind:fzValid {demo} />
	</div>
	<div class="r14">{halterValid}/{standortValid} - {needsStandort}</div>
	<div class="ra2">
    
        <!--   PLZ immer gültig markieren  -->
        <Adresse
            plzValid={halterPlzValid}
            title={texte.halter[rawLead.sprache]}
            lang={rawLead.sprache}
            adresse={rawLead.halter}
            bind:adrValid={halterValid}
        ></Adresse>
	</div>
	<div class="ra2">

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
	<div class="r14">&#160;</div>
	<div>
		{#if !rawLead.halter || rawLead.halter.anredeid != 3}
			{texte.geburtstag[lang]}
		{/if}
	</div>
	<div>
		{#if !rawLead.halter || rawLead.halter.anredeid != 3}
			{#if rawLead.geburtstagunbekannt}
				<input type="date" bind:value={rawLead.geburtstag} required="false" disabled="true" />
			{:else}
				<input type="date" bind:value={rawLead.geburtstag} required="true" />
			{/if}
			<input type="checkbox" bind:checked={rawLead.geburtstagunbekannt} />
			{texte.unbekannt[lang]}
		{/if}
	</div>
	<div class="c12">{texte.bemerkung[lang]}</div>
	<div class="c12">
		<textarea class="bemerkung" bind:value={rawLead.bemerkungen} />
	</div>
	<div>
		{#if !rawLead.halter || rawLead.halter.anredeid != 3}
			{texte.nation[lang]}
		{/if}
	</div>
	<div>
		{#if !rawLead.halter || rawLead.halter.anredeid != 3}
			<select class="large" bind:value={rawLead.nationalitaet} required="true">
				<option value="">--------</option>
				{#each nationalitaeten as nationalitaet}
					<option value={nationalitaet.bezeichnung}>
						{nationalitaet.bezeichnung}
					</option>
				{/each}
			</select>
		{/if}
	</div>

	<div class="r14">&#160;</div>
</div>

<div class="evn2">
	<div class="r13 bg1">
		{texte.rueckfragen[lang]}<br />
		{#if rawLead.garage_idkey == 'AUTOKUNZ'}
			<select class="large" bind:value={disponentid} required="true">
				<option value="">--------</option>
				{#each disponenten as dispo}
					<option value={dispo.id}>
						{dispo.bezeichnung}
					</option>
				{/each}
			</select>
			{#if disponentid != ''}
				<div>
					{texte.kontakt[lang]}:
					<b
						>{kontakt.anredeid == 2 ? 'Frau' : 'Herr'}
						{kontakt.vorname}
						{kontakt.nachname},
						{kontakt.telefon},
						{kontakt.email}
					</b>
				</div>
			{/if}
		{:else if !kontaktEdit && !invalidTel}
			{texte.kontakt[lang]}:
			<b
				>{rawLead.garage_firma},
				{kontakt.anredeid == 2 ? 'Frau' : 'Herr'}
				{kontakt.vorname}
				{kontakt.nachname},
				{kontakt.telefon},
				{kontakt.email}
			</b>
			<span class="link" class:invalid={invalidTel} on:click={doEditKontakt}
				>&#160;[{texte.aendern[lang]}]&#160;
			</span>
		{:else}
			<div class="r14">&#160;</div>
			<div class="r14">
				<div class="gridkontakt">
					<div>{texte.garage[lang]}:</div>
					<div><input class="long" type="text" bind:value={kontakt.firma} /></div>
					<div>{texte.anrede[lang]}:</div>
					<div>
						<select bind:value={kontakt.anredeid} required="true">
							<option value="">--------</option>
							{#each anreden as anrede}
								<option value={anrede.id}>
									{anrede.value}
								</option>
							{/each}
						</select>
					</div>
					<div>
						{texte.vornamename[lang]}:
					</div>
					<div>
						<input type="text" bind:value={kontakt.vorname} />
						<input type="text" bind:value={kontakt.nachname} />
					</div>
					<div>{texte.tel[lang]}:</div>
					<div><input type="text" bind:value={kontakt.telefon} class:invalid={invalidKTel} /></div>
					<div>
						{texte.email[lang]}:
					</div>
					<div>
						<input class="long" type="text" bind:value={kontakt.email} />
						<span>&#160;&#160;&#160;</span>
						<span class="link invalid" on:click={doSaveKontakt}
							>[{texte.kontaktspeichern[lang]}]</span
						>
					</div>
					<div></div>
					<div></div>
				</div>
			</div>
		{/if}
	</div>
	<div class="r4c2 bg2">
		<u>{texte.datenschutz[lang]}</u>
		{texte.datenschutz2[lang]}<br /><br /> <input type="checkbox" bind:checked={dataChecked} />
		<span class="link" on:click={toggleHalterCheck}>
			<span class:invalid={!dataChecked}>{texte.pruefung[lang]}</span>
			<span>{texte.pruefung2[lang]}</span>
			<span class:invalid={!dataChecked}>{texte.pruefung3[lang]}</span>
		</span>
		<span>&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;</span>
	</div>
	<div class="r13"></div>
	<div />
	<div class="r14">&#160;</div>
	<div class="r12">
		<div class="footer">
			{#if rawLead.agent == 'BME'}
				<div>
					<img style="width: 450px" src="images/CW Header transparent.png" alt="evn-logo" />
				</div>
			{:else}
				<div style="padding-top:3px">
					{texte.service[lang]}&#160;&#160;&#160;&#160;&#160;&#160;&#160;Tel. 041 / 559 29 39
				</div>
				<div><img style="height: 25px" src="images/evn-logo.png" alt="evn-logo" /></div>
			{/if}
		</div>
	</div>
	<div></div>
	<div class="r33">
		<button
			style="margin-top:9px"
			on:click={saveEVN}
			disabled={btnClicked ||
				!dataChecked ||
				!evnValid ||
				!fzValid ||
				!adrValid ||
				(stAdr && (!sadrValid || !stAdrPlzOk))}>{texte.bestellen[lang]}</button
		>
		{#if sent}
			{#if sendMessage}
				<br /><br /><span class="messageleft big">{texte.sendError[lang]}</span>
				<br /><span class="messageleft">{sendMessage}</span>
			{:else}
				<br /><br /><span class="messageleft">{texte.sent[lang]}</span>
				<br /><span class="messageleft">{texte.sent2[lang]}</span>
			{/if}
		{/if}
	</div>
	<div class="r44">
		<img style="height: 50px" src="images/{brandSrc2}" alt="i-logo" />
	</div>
</div>

<!--
<div>
    D{dataChecked} E{evnValid} F{fzValid} A{adrValid} S{stAdr && sadrValid}
    T{invalidKTel}TT{invalidTel}
</div>
<div class="footer">
    <div style="padding-top:3px">{texte.service[lang]}&#160;&#160;&#160;&#160;&#160;&#160;&#160;Tel. 041 / 559 29 39</div>
    <div><img style="height: 25px" src="images/evn-logo.png" alt="evn-logo"/></div>
</div>    
<div>{JSON.stringify(pdata)}</div>
<div>{JSON.stringify(rawLead.marke)}</div>
-->
<style>
	select:invalid,
	input:invalid,
	input.invalid {
		background-color: var(--input-invalid-bg-color);
		color: var(--input-invalid-color);
		border: 1pt solid rgb(99, 99, 99);
	}

	.long {
		width: 275px;
	}
	.big {
		font-size: 15pt;
	}
	.footer {
		display: grid;
		grid-template-columns: 350px 280px;
		padding-top: 10px;
		font-size: 0.9rem;
		color: #777777;
		height: 40px;
	}

	.gridkontakt {
		display: grid;
		grid-template-columns: 150px 450px;
		grid-auto-rows: auto;
		grid-column-gap: 0px;
		grid-row-gap: 0px;
	}

	.fzlong {
		background-color: rgb(91, 50, 205);
		grid-column: 1 / span 4;
		border-bottom: 1pt solid white;
		padding: 3px;
	}
	.col2 {
		background-color: yellowgreen;
		grid-column: 1 / span 2;
		border-bottom: 1pt solid white;
		padding: 3px;
	}
	.col22 {
		background-color: rgb(179, 50, 205);
		grid-column: 3 / span 2;
		border-bottom: 1pt solid white;
		padding: 3px;
	}

	.evn {
		display: grid;
		grid-template-columns: 220px 320px 220px 490px;
	}

	.evn2 {
		display: grid;
		grid-template-columns: 220px 320px 220px 400px 130px;
	}

	.ra2 {
		grid-column: auto / span 2;
	}
	.r12 {
		grid-column: 1 / span 2;
	}
	.r14 {
		grid-column: 1 / span 4;
	}
	.r13 {
		grid-column: 1 / span 3;
	}

	.gr {
		background-color: aqua;
	}
	.r4c2 {
		grid-row: auto / span 2;
		grid-column: 4 / span 2;
		/*        text-align: right; */
	}
	.r34 {
		grid-column: 3 / span 2;
	}
	.r33 {
		grid-column: 4 / span 1;
	}
	.r44 {
		grid-column: 5 / span 1;
	}
	.c12 {
		grid-row: auto / span 2;
	}

	.bemerkung {
		width: 440px;
		height: 60px;
	}
</style>
