<script>
	import Adresse from './Adresse.svelte';
	import Fahrzeug from './Fahrzeug.svelte';
	import { texte } from '$lib/texte.js';
import {lead} from '$lib/lead.svelte.ts';

	let {
		lang = 'it',
		sent = $bindable(),
		redoEvn = $bindable(),
		demo = $bindable()
	} = $props();

	let kontakt = $state({});

	let btnClicked = $state(false);

	let pdata = $state([]);
	let psodata = $state([]);

	const prod = true;

	const baseUrlS = prod ? 'https://api.car-ware.ch/' : 'http://127.0.0.1:3344/';
	const baseUrlL = prod
		? 'https://lead.car-ware.ch/pavServer/'
		: 'http://127.0.0.1:8080/api/pavServer/';

	let disponenten = lead.lead.disponenten;

	let nationalitaeten = lead.lead.nationalitaeten;
	$effect(() => {
		$inspect('lead:', lead.lead)
	})
	$effect(() => {
		if (!lead.lead.anredeid_so) lead.lead.anredeid_so = '';
		if (!lead.lead.vorname_so) lead.lead.vorname_so = '';
		if (!lead.lead.nachname_so) lead.lead.nachname_so = '';
	});

	const checkPlzSOL = async () => {
		let kanton = lead.lead.kanton;
		console.log('checkPlzSOL', kanton);
		let plz = lead.lead.standort ? lead.lead.standort.plz : null;
		if (plz && kanton && plz.length >= 4) {
			try {
				let d = await fetch(baseUrlS + 'plzOrt?plz=' + plz + '&kanton=' + kanton + '');
				let p = await d.json();
				psodata = p;
			} catch (err) {
				alert(err); // Failed to fetch
			}
		}
	};

	const checkPlzL = async () => {
		let kanton = lead.lead.kanton;
		console.log('checkPlzL', kanton);
		let plz = lead.lead.halter ? lead.lead.halter.plz : null;
		savedPLZ = plz;
		if (plz && kanton) {
			try {
				let d = await fetch(baseUrlS + 'plzOrt?plz=' + plz + '&kanton=' + kanton + '');
				let p = await d.json();
				pdata = p;
			} catch (err) {
				alert('checkplzl:' + err); // Failed to fetch
			}
		}
	};
	/*
    const checkPlzSO = async (plz, kanton) => {
        if (plz && kanton) {
            try {
                let d = await fetch(
                    baseUrlS + "plzOrt?plz=" +
                    plz +
                    "&kanton=" +
                    kanton +
                    ""
                );  
                let p = d.json();
                p.then((d) => (psodata = d));
            } catch (err) {
             alert(err); // Failed to fetch
            }
        }
    };

    
*/

	/*
    $effect(() => {
        if (lead.halter && rawLead.halter.plz) {
            if (rawLead.kanton) {
                checkPlz(rawLead.halter.plz, rawLead.kanton);
            }
        }
    })

    $: if (rawLead.standort && rawLead.standort.plz) {
        if (rawLead.kanton) {
            checkPlzSO(rawLead.standort.plz, rawLead.kanton);
        }
    }
*/

	let savedKanton = '';
	let savedPLZ = '';
	let savedPLZSO = '';
	/*
$effect(()=> {
    if (savedPLZ?.length == 4 || rawLead && savedKanton != rawLead.kanton || rawLead && rawLead.halter && savedPLZ != rawLead.halter.plz) {
    checkPlzL();
    checkPlzSOL();
}
})
*/
	/*

$effect(()=> {
    if (rawLead && rawLead.standort && savedPLZSO != rawLead.standort.plz) {
    savedPLZSO = rawLead.standort.plz;
    checkPlzL();
    checkPlzSOL();
}

})
*/
	/*
$: if (rawLead && rawLead.standort) {
    checkPlzSO(rawLead.standort.plz, rawLead.kanton);
}
*/
	/*
$: {
        halter = rawLead.halter;
    }
*/
	//    let halter = { id: 0, name: "", adresse: "", plz: "" };
	//    let standort = { id: 0, name: "", adresse: "", plz: "", ort: "" };
	/*
    $: {
        if (halter.anredeid) {
            rawLead.anredeid = halter.anredeid;
        }
    }
*/
	let matchPlz = false;

	let fzValid = $state(false);
	let adrValid = $state(false);
	let sadrValid = $state(false);
	//    let evnValid = false;
	let dataChecked = $state(false);
	let stAdr = $state(false);

	let plok = $state(true);
	const setPlok = () => {
		plok = false;
		setTimeout(() => {
			plok = true;
		}, 200);
	};
	/*
    $: if (stAdr) {
     //       setPlok();
    }
*/
	$effect(() => {
		stAdr = lead.lead.kanton && lead.lead.halter && lead.lead.halter?.plz?.length >= 4 && !pdata.length;
		$inspect(lead.lead.kanton);
		//    console.log(lead.lead.halter)
		$inspect(lead.lead.halter?.plz);
		//    console.log(pdata)
		$inspect(stAdr);
		if (!stAdr || !lead.lead.standort || !lead.lead.standort.id) {
			lead.lead.standort = { id: 1, name: '', adresse: '', plz: '', ort: '' };
		}
	});
	let stAdrPlzOk = $derived(lead.lead.kanton && psodata.length);

	const toggleHalterCheck = () => {
		dataChecked = !dataChecked;
	};
	const checkFormsValid = (rec) => {
		let isValid = true;
		if (lead.lead) {
			isValid = isValid && (rec.nationalitaet || (lead.lead.halter && lead.lead.halter.anredeid == 3));
			isValid =
				isValid &&
				(rec.geburtstag ||
					(lead.lead.halter && lead.lead.halter.anredeid == 3) ||
					lead.lead.geburtstagunbekannt);
			isValid = isValid && rec.user_telefon.length >= 10;
			if (lead.lead.garage_idkey == 'AUTOKUNZ') {
				isValid = isValid && disponentid != '';
			}
		}
		return isValid;
	};
	let kontaktEdit = $state(false);

	let evnValid = $derived(
		(checkFormsValid(lead.lead) && !kontaktEdit) ||
			(lead.lead.garage_idkey == 'AUTOKUNZ' && !disponentid)
	);
	let invalidTel = $derived(!lead.lead || !lead.lead.user_telefon || lead.lead.user_telefon.length < 10);
	let invalidKTel = $derived(!kontakt.telefon || kontakt.telefon.length < 10);

	let sendMessage = null;
	const saveEVN = async () => {
		btnClicked = true;
		//        lead.lead.standort = standort;
		lead.lead.redo = redoEvn;
		let jsonRawlead = JSON.stringify(lead.lead);
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
					baseUrlL + 'ngSendEVN.json?irenehassuchasmile&id=' + lead.lead.id,
					//                "http://127.0.0.1:8080/api/pavServer/ngSendEVN.json?irenehassuchasmile&id=" + lead.id,
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

	const getKontakt = async () => {
		try {
			const options = {
				method: 'GET'
			};

			const fetchResponse = await fetch(
				baseUrlS + 'getKontakt?user_email=' + lead.lead.user_email + '',
				options
			);
			const data = await fetchResponse.json();
			console.log(data); //200
			return data;
		} catch (err) {
			console.log(err);
		}
	};
	const doEditKontakt = () => {
		kontaktEdit = true;
	};

	const doSaveKontakt = async () => {
		if (invalidKTel) return;
		kontaktEdit = false;
		if (!kontaktEdit) {
			kontakt.user_email = lead.lead.user_email;
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

	$effect(() => {
		console.log('kontakt')
		if (lead.lead.id && !kontakt.done) {
			kontakt.done = true;
			if (lead.lead.garage_idkey != 'AUTOKUNZ') {
				getKontakt().then((data) => {
					if (data.id) {
						kontakt = data;
						lead.lead.garage_firma = data.firma;
						lead.lead.user_anredeid = data.anredeid;
						lead.lead.user_vorname = data.vorname;
						lead.lead.user_nachname = data.nachname;
						lead.lead.user_telefon = data.telefon;
						lead.lead.dispo_email = data.email;
					} else {
						kontakt = {
							firma: lead.lead.garage_firma,
							anredeid: lead.lead.user_anredeid,
							vorname: lead.lead.user_vorname,
							nachname: lead.lead.user_nachname,
							telefon: lead.lead.user_telefon,
							email: lead.lead.user_email
						};
					}
					kontakt.done = true;
				});
			}
		}
	});

	const brandSrc2 = `carware.png`;
	let disponentid = $state('');

	let fz=$derived ({marke: lead.lead.marke})
	$effect(() => {
		if (disponentid) {
			let dsp = disponenten.filter((d) => d.id == disponentid);
			let dspn = dsp[0];
			kontakt.email = dspn.email;
			kontakt.anredeid = dspn.anredeid;
			kontakt.nachname = dspn.nachname;
			kontakt.vorname = dspn.vorname;
			kontakt.telefon = dspn.telefon;
			lead.lead.user_email = dspn.email;
			lead.lead.user_anredeid = dspn.anredeid;
			lead.lead.user_nachname = dspn.nachname;
			lead.lead.user_vorname = dspn.vorname;
			lead.lead.user_telefon = dspn.telefon;
			kontaktEdit = false;
		} else {
			//            kontaktEdit = rawlead.lead.garage_idkey == 'AUTOKUNZ';
		}
	});
	$effect(() => {
		if (lead.lead.geburtstagunbekannt) {
			lead.lead.geburtstag = null;
		}
	});

	// standort Adresse ist OK
	let standortAdrOK = $state(true);
	let halterAdresseValid = $state(false);
	// standort Adresse ist gültig
	let standortAdresseValid = $state(false);
</script>


<div>
	
</div>
<div class="evn">
	<div class="r14">
		<Fahrzeug {lang} bind:fzValid  {demo} />
	</div>
	<div class="r14">&#160;</div>
	<div class="ra2">
		{JSON.stringify(pdata)}
		{#if lead.lead.halter}
		<Adresse
			bind:adresse={lead.lead.halter}
			{lang}
			title={texte.halter[lang]}
			bind:adrValid={halterAdresseValid}
			plzValid = {true}
		/>
		{/if}
	</div>
	<div class="ra2">
		{#if !halterAdresseValid && lead.lead?.standort}
			{JSON.stringify(psodata)}
			<Adresse
				adrOk="bind:{standortAdrOK}"
				{lang}
				title={texte.standort[lang]}
				bind:adrValid={standortAdresseValid}
				plzValid={stAdrPlzOk}
				bind:adresse={lead.lead.standort}
			/>
		{/if}
	</div>
	<div class="r14">&#160;</div>
	<div>
		{#if !lead.lead.halter || lead.lead.halter.anredeid != 3}
			{texte.geburtstag[lang]}
		{/if}
	</div>
	<div>
		{#if !lead.lead.halter || lead.lead.halter.anredeid != 3}
			{#if lead.lead.geburtstagunbekannt}
				<input type="date" bind:value={lead.lead.geburtstag} required="false" disabled="true" />
			{:else}
				<input type="date" bind:value={lead.lead.geburtstag} required="true" />
			{/if}
			<input type="checkbox" bind:checked={lead.lead.geburtstagunbekannt} />
			{texte.unbekannt[lang]}
		{/if}
	</div>
	<div class="c12">{texte.bemerkung[lang]}</div>
	<div class="c12">
		<textarea class="bemerkung" bind:value={lead.lead.bemerkungen} />
	</div>
	<div>
		{#if !lead.lead.halter || lead.lead.halter.anredeid != 3}
			{texte.nation[lang]}
		{/if}
	</div>
	<div>
		{#if !lead.lead.halter || lead.lead.halter.anredeid != 3}
			<select class="large" bind:value={lead.lead.nationalitaet} required="true">
				<option value="">--------</option>
			</select>
		{/if}
	</div>
<!--
-->	
	<div class="r14">&#160;</div>
</div>

<div class="evn2">
	<div class="r13 bg1">
		{texte.rueckfragen[lang]}<br />
		{#if lead.lead.garage_idkey == 'AUTOKUNZ'}
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
				>{lead.lead.garage_firma},
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
			{#if lead.lead.agent == 'BME'}
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
<div>{JSON.stringify(rawlead.lead.marke)}</div>
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
