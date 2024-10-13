<script>
	let { lang = 'it', fzValid = $bindable(false), demo } = $props();

	import { texte } from '$lib/texte.js';
	import AxaAgentur from './AxaAgentur.svelte';

	import { lead } from '$lib/lead.svelte';
	let fahrzeug = lead.lead;




    let invalidtypenschein = $state(true);
    let invalidKfz = $state(true);
	let invalidchassisnr = $state(true);
	let invalidstammnr = $state(true);
	let invalidvnab = $state(true);
	let invalidinvsetz = $state(true);
	let invalidPreis = $state(true);
	let invalidPreisZB = $state(true);

	let versicherungen = $state([
		{ id: '', value: '--' },
		{ id: 1, value: 'AXA' },
		{ id: 2, value: 'Generali' }
	]);

	const kantone = [
		{ itemid: '', bezeichnung: '--' },
		{ itemid: 'AG', bezeichnung: 'AG' },
		{ itemid: 'AI', bezeichnung: 'AI' },
		{ itemid: 'AR', bezeichnung: 'AR' },
		{ itemid: 'BE', bezeichnung: 'BE' },
		{ itemid: 'BL', bezeichnung: 'BL' },
		{ itemid: 'BS', bezeichnung: 'BS' },
		{ itemid: 'FL', bezeichnung: 'FL' },
		{ itemid: 'FR', bezeichnung: 'FR' },
		{ itemid: 'GE', bezeichnung: 'GE' },
		{ itemid: 'GL', bezeichnung: 'GL' },
		{ itemid: 'GR', bezeichnung: 'GR' },
		{ itemid: 'JU', bezeichnung: 'JU' },
		{ itemid: 'LU', bezeichnung: 'LU' },
		{ itemid: 'NE', bezeichnung: 'NE' },
		{ itemid: 'NW', bezeichnung: 'NW' },
		{ itemid: 'OW', bezeichnung: 'OW' },
		{ itemid: 'SG', bezeichnung: 'SG' },
		{ itemid: 'SH', bezeichnung: 'SH' },
		{ itemid: 'SO', bezeichnung: 'SO' },
		{ itemid: 'SZ', bezeichnung: 'SZ' },
		{ itemid: 'TG', bezeichnung: 'TG' },
		{ itemid: 'TI', bezeichnung: 'TI' },
		{ itemid: 'UR', bezeichnung: 'UR' },
		{ itemid: 'VD', bezeichnung: 'VD' },
		{ itemid: 'VS', bezeichnung: 'VS' },
		{ itemid: 'ZG', bezeichnung: 'ZG' },
		{ itemid: 'ZH', bezeichnung: 'ZH' }
	];
	const janein = [
		{ id: '', value: '--' },
		{ id: false, value: texte.nein[lang] },
		{ id: true, value: texte.ja[lang] }
	];
	const ivgrund = [
		{ id: '', value: '--' },
		{ id: texte.neueinloes.de, value: texte.neueinloes[lang] },
		{ id: texte.fzwechsel.de, value: texte.fzwechsel[lang] },
		{ id: texte.wechsel.de, value: texte.wechsel[lang] }
	];
	const setNew = () => {
		fahrzeug.kennzeichen = texte.neu[lang];
	};

	let short = $state(true);

	const toggleSL = () => {
		short = !short;
	};

	let cn = '';
	// Chassisnr
	const typenscheinValid = () => {
		if (fahrzeug.typenschein?.length >=1) {
			return true;
		}
		return false;
	};
	// Chassisnr
	const chassisnrValid = () => {
		if (fahrzeug.chassisnr) {
			cn = fahrzeug.chassisnr;
			let i = cn.indexOf(' ');
			while (i > 0) {
				cn = cn.replace(' ', '');
				i = cn.indexOf(' ');
			}
			if (cn.length != 17) return false;
			return true;
		}
		return false;
	};
	$effect(() => {
		if (fahrzeug.typenschein) {
			console.log('typ');
			invalidtypenschein = !typenscheinValid();
		}
	});
	$effect(() => {
		if (fahrzeug.chassisnr) {
			console.log('111');
			invalidchassisnr = !chassisnrValid();
		}
	});
	// Stammnr
	const checkStammnr = (stammnr) => {
		// Format 000.000.000
		if (stammnr.substring(3, 4) != '.') return false;
		if (stammnr.substring(7, 8) != '.') return false;
		let sStammnr = stammnr.replaceAll('.', '');
		// Länge prüfen
		if (sStammnr.length != 9) return false;
		// alles Zahlen
		if (isNaN(sStammnr)) return false;

		// Checksumme berechnen und prüfen
		const multiplikator = [3, 2, 7, 6, 5, 4, 3, 2];
		let summe = 0;
		let ziffer = 0;
		for (let i = 1; i <= sStammnr.length; i++) {
			ziffer = sStammnr.substring(i - 1, i);
			if (i < 9) {
				summe = summe + ziffer * multiplikator[i - 1];
			}
		}
		let checksum = summe % 11;
		if (checksum == 10) {
			checksum = 0;
		}

		if (checksum != ziffer) {
			return false;
		}
		return true;
	};

	const stammnrValid = () => {
		if (fahrzeug.stammnr) {
			if (checkStammnr(fahrzeug.stammnr)) {
				return true;
			}
		}
		return false;
	};
	$effect(() => {
		if (fahrzeug.stammnr) {
			console.log('sss');
			invalidstammnr = !stammnrValid();
		}
	});

	// Kennzeichen
	const kfzValid = () => {
		if (fahrzeug.kennzeichen) {
			//            fahrzeug.kennzeichen = fahrzeug.kennzeichen.toUpperCase();
			let last = fahrzeug.kennzeichen.length - 1;
			for (let i = 0; i < fahrzeug.kennzeichen.length; i++) {
				if (fahrzeug.kennzeichen.toLowerCase() == 'neu') return true;
				if (fahrzeug.kennzeichen.toLowerCase() == 'neuf') return true;
				if (fahrzeug.kennzeichen.toLowerCase() == 'nuovo') return true;
				if (fahrzeug.kennzeichen[i] < '0' || fahrzeug.kennzeichen[i] > '9') {
					if (i != last) {
						if (fahrzeug.kennzeichen[i] != ' ') {
							return false;
						}
					} else {
						if (
							fahrzeug.kennzeichen[i].toUpperCase() != 'U' &&
							fahrzeug.kennzeichen[i].toUpperCase() != 'Z' &&
							fahrzeug.kennzeichen[i] != ' '
						) {
							return false;
						}
					}
				}
			}
			//            if (fahrzeug.kennzeichen.length != 3) return false;
			return true;
		}
		return false;
	};
	$effect(() => {
		if (fahrzeug.kennzeichen) {
			console.log('kkk');
			invalidKfz = !kfzValid();
		}
	});

	// Nachweis ab..
	const vnabValid = () => {
		if (!fahrzeug.vnab) {
			return false;
		}
		let vnab = new Date();
		if (fahrzeug.vnab) {
			vnab = new Date(fahrzeug.vnab);
			deadline = vnab.addDays(1);
		}
		if (today > deadline) {
			return false;
		}
		return true;
	};

	// Invsez..
	const invsetzValid = () => {
		if (short) return true;
		if (!fahrzeug.invsetz) {
			return false;
		}
		return true;
	};

	const kmValid = () => {
		if (fahrzeug.kilometer == 0) {
			return true;
		}
		if (!fahrzeug.kilometer) {
			return false;
		}
		return true;
	};
	const aufbauValid = () => {
		if (!fahrzeug.aufbau) {
			return false;
		}
		if (fahrzeug.aufbau.length < 3) {
			return false;
		}
		return true;
	};

	const npValid = () => {
		if (!fahrzeug.katalogpreis) {
			short = false;
			return false;
		}
		return true;
	};
	const pzValid = () => {
		if (!fahrzeug.preiszubehoer) {
			short = false;
			return false;
		}
		return true;
	};

	$effect(() => {
		if (fahrzeug.vnab) {
			console.log('sss2');
			invalidvnab = !vnabValid();
		}
	});

	$effect(() => {
		if (fahrzeug.invsetz) {
			console.log('sss44');
			invalidinvsetz = !invsetzValid();
		}
	});

	$effect(() => {
		if (fahrzeug.katalogpreis) {
			console.log('sssjj');
			invalidPreis = !npValid();
		}
	});

	$effect(() => {
		if (fahrzeug.preiszubehoer) {
			console.log('sssdfsdaf');
			invalidPreisZB = !pzValid();
		}
	});

	$effect(() => {
		if (fahrzeug.invsetz) {
			console.log('sssfdsfsdf');
			invalidinvsetz = !invsetzValid();
		}
	});

	// Prüfung Axa Einstellung
	const axaCheck = () => {
		if (fahrzeug.versicherung.toLowerCase() != 'axa') {
			// nicht Axa
			return true;
		} else {
			if (!verkaeuferAxaAgent.choice) {
				return true;
			} else {
				if (verkaeuferAxaAgent.choice == 1) {
					return verkaeuferAxaAgent.axaagentid != 0;
				}
				if (verkaeuferAxaAgent.choice == 2) {
					return verkaeuferAxaAgent.temp != 0;
				}
			}
			return false;
		}
	};

	$effect(() => {
		{
			if (fahrzeug && !short) {
				console.log('ssshh');
				checkFormsValid(fahrzeug);
			}
		}
	});
	const checkFormsValid = (rec) => {
		let isValid = true;
		if (fahrzeug) {
			if (fahrzeug.ivgrund == texte.fzwechsel.de) {
				let vld = fahrzeug.ws != null && fahrzeug.ws !== '';
				if (!vld) {
					isValid = false;
				} else {
					if (fahrzeug.ws) {
						isValid = isValid && fahrzeug.wsmarketyp?.length > 1;
					}
				}
			}

			// Fahrzeug Felder
			isValid = isValid && invsetzValid();
			isValid = isValid && kmValid();
			isValid = isValid && npValid();
			isValid = isValid && pzValid();
			isValid = isValid && aufbauValid();

			isValid = isValid && fahrzeug.kanton;
			isValid = isValid && fahrzeug.kennzeichen;
			isValid = isValid && fahrzeug.versicherung;

			isValid = isValid && axaCheck();

			isValid = isValid && vnabValid();
			isValid = isValid && chassisnrValid();
			isValid = isValid && stammnrValid();
			isValid = isValid && typenscheinValid();
			isValid = isValid && kfzValid();
			isValid = isValid && (fahrzeug.leasing === true || fahrzeug.leasing === false);

			isValid = isValid && fahrzeug.ivgrund;
		}
		return isValid;
	};
	$effect(() => {
		console.log('checkFormsValid(fahrzeug)');
		fzValid = !!checkFormsValid(fahrzeug);
	});

	let today = new Date();
	let deadline = '???';
	let abgabeDOW = '??';

	let abgabeFehler = '';
	Date.prototype.addDays = function (days) {
		let dateVal = this.valueOf();
		dateVal = this.valueOf() + 6 * 60 * 60 * 1000;
		var date = new Date(dateVal);
		date.setDate(date.getDate() + days);
		return date;
	};

	const getVersicherungen = async () => {
		versicherungen = [
			{ id: '', value: '--' },
			{ bezeichnung: 'Lloyds', id: 'Lloyds', value: 'Lloyds' }
		];
		try {
			let d = await fetch('https://api.car-ware.ch/versicherung');
			let p = d.json();
			p.then((d) => {
				// Versicherungen abfüllen
				if (demo) {
					versicherungen = [
						{ id: '', value: '--' },
						{ bezeichnung: 'Lloyds', id: 'Lloyds', value: 'Lloyds' }
					];
				} else {
					versicherungen = [{ id: '', value: '--' }, ...d];
					d.map((i) => {
						i.id = i.bezeichnung;
						i.value = i.bezeichnung;
					});
				}
			});
		} catch (err) {
			//            alert(err); // Failed to fetch
		}
	};
	getVersicherungen();

	$effect(() => {
		if (demo) {
			getVersicherungen();
		}
	});

	let agenturid = 0;
	$effect(() => {
		console.log('axa');
		if (fahrzeug) {
			verkaeuferAxaAgent.verkaeuferemail = fahrzeug.user_email;
			if (fahrzeug.versicherung == 'AXA') {
				fahrzeug.versicherungemail = '';
			} else {
				let em = versicherungen.filter((v) => v.id == fahrzeug.versicherung);
				fahrzeug.versicherungemail = '';
				if (em.length) {
					fahrzeug.versicherungemail = em[0].emailevn;
				}
			}
		}
	});
	$effect(() => {
		console.log('sitzplatz');
		if (fahrzeug) {
			if (fahrzeug.sitzplatz) {
				let sp = fahrzeug.sitzplatz;
				let spF = sitzplatzSel.filter((s) => s == sp);
				if (!spF.length) {
					sitzplatzSel.push(sp);
				}
			}
		}
	});

	let verkaeuferAxaAgent = $state({ choice: 0, temp:0 });
	let sitzplatzSel = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
</script>

<!--
{JSON.stringify(fahrzeug)}
-->
{#if fahrzeug.kennzeichen && fahrzeug.kennzeichen.toLowerCase() != texte.neu[lang].toLowerCase() && fahrzeug.ivgrund == texte.neueinloes['de']}
	<div class="floatinginfo">
		{texte.ivinfo1[lang]}<br />
		{texte.ivinfo2[lang]}<br /><br />
		{texte.ivinfo3[lang]}<br />
	</div>
{/if}
<div class="gridevnfztitle">
	<div class="r14"><hr /></div>
	<div class="r12 fahrzeug">
		{fahrzeug.marke}
		{fahrzeug.modell}
		{fahrzeug.typ}
	</div>
	<div class="r34">
		{#if short}
			<button class="showfz" on:click={toggleSL}>{texte.alle[lang]}</button>
		{:else}
			<button class="showfz" on:click={toggleSL}>{texte.weniger[lang]}</button>
		{/if}
	</div>
</div>
<div class="gridevn2">
	{#if !short}
		<div>{texte.marke[lang]}</div>
		<div>
			{fahrzeug.marke}
		</div>
		<div />
		<div />
		<div>{texte.modell[lang]}</div>
		<div>
			{fahrzeug.modell}
			{fahrzeug.typ}
		</div>
		<div>{texte.inv[lang]}</div>
		<div>
			<input
				class:invalid={invalidinvsetz}
				type="date"
				bind:value={fahrzeug.invsetz}
				required="true"
			/>
		</div>
		<div>{texte.motor[lang]}</div>
		<div>
			{fahrzeug.hubraum} ccm /
			{fahrzeug.ps} PS /
			{fahrzeug.getriebe}
		</div>
		<div>{texte.sitz[lang]}</div>
		<div>
			<select bind:value={fahrzeug.sitzplatz}>
				{#each sitzplatzSel as s}
					<option value={s}>{s}</option>
				{/each}
			</select>
		</div>
		<div>{texte.kilometer[lang]}</div>
		<div>
			<input type="number" bind:value={fahrzeug.kilometer} required="true" /> km
		</div>
		<div>{texte.typ[lang]}</div>
		<div>
			{fahrzeug.aufbau}
			<!--
            <input type="text" class:invalid="{invalidAufbau}" bind:value={fahrzeug.aufbau} required="true" /> 
-->
		</div>
		<div>{texte.neupreis[lang]}</div>
		<div>
			<input
				class:invalid={invalidPreis}
				type="number"
				bind:value={fahrzeug.katalogpreis}
				required="true"
			/> CHF
		</div>
		<div>{texte.zub[lang]}</div>
		<div>
			<input
				class:invalid={invalidPreisZB}
				type="number"
				bind:value={fahrzeug.preiszubehoer}
				required="true"
			/> CHF
		</div>
		<div></div>
		<div></div>
		<div>{texte.zzub[lang]}</div>
		<div>
			<input
				class:invalid={invalidPreisZB}
				type="number"
				bind:value={fahrzeug.preiszusatzzubehoer}
				required="true"
			/> CHF
		</div>
	{:else}
		<div class="r14"><hr /></div>
	{/if}
	<div class="r14">&#160;</div>
	<div class="span4">
		<u>{texte.bitte[lang]}</u>
	</div>
	<div class="span4">&#160;</div>

	<div>{texte.kennzeichen[lang]}</div>
	<div>
		<select bind:value={fahrzeug.kanton} required="true">
			{#each kantone as art}
				<option value={art.itemid}>{art.bezeichnung}</option>
			{/each}
		</select>
		<input
			class="kennzeichen"
			type="text"
			class:invalid={invalidKfz}
			bind:value={fahrzeug.kennzeichen}
			required="true"
		/>
		<button on:click={setNew} class="mini">{texte.neu[lang]}</button>
	</div>

	<div>{texte.ivgrund[lang]}</div>
	<div>
		<select class="ivgrund" bind:value={fahrzeug.ivgrund} required="true">
			{#each ivgrund as art}
				<option value={art.id}>{art.value}</option>
			{/each}
		</select>
	</div>

	<div>{texte.versicherung[lang]}</div>
	<div>
		<select title={fahrzeug.versicherungemail} bind:value={fahrzeug.versicherung} required="true">
			{#each versicherungen as art}
				<option value={art.id}>{art.value}</option>
			{/each}
		</select>
	</div>
	{#if fahrzeug.ivgrund == texte.fzwechsel.de}
		<div class="r34">
			{texte.ws1[lang]}<span class="spacer" />
			<select bind:value={fahrzeug.ws} required="true">
				{#each janein as art}
					<option value={art.id}>{art.value}</option>
				{/each}
			</select>
		</div>
	{:else}
		<div></div>
		<div></div>
	{/if}

	{#if fahrzeug.versicherung == 'AXA'}
		<div class="r12">
			<AxaAgentur bind:verkaeuferAxaAgent sprache={lang} />
		</div>
		{#if fahrzeug.ivgrund == texte.fzwechsel.de && fahrzeug.ws}
			<div class="r34">
				{texte.ws2[lang]}<span class="spacer" />
				<input
					class="large"
					class:invalid={fahrzeug.wsmarketyp?.length < 2}
					placeholder={texte.marketyp[lang]}
					type="text"
					bind:value={fahrzeug.wsmarketyp}
					required="true"
				/>
			</div>
		{:else}
			<div></div>
			<div></div>
		{/if}
	{/if}
	<div>{texte.vnab[lang]}</div>
	<div>
		<input class:invalid={invalidvnab} type="date" bind:value={fahrzeug.vnab} required="true" />
	</div>
	{#if fahrzeug.versicherung != 'AXA' && fahrzeug.ivgrund == texte.fzwechsel.de && fahrzeug.ws}
		<div class="r34">
			{texte.ws2[lang]}<span class="spacer" />
			<input
				class="large"
				class:invalid={fahrzeug.wsmarketyp?.length < 2}
				placeholder={texte.marketyp[lang]}
				type="text"
				bind:value={fahrzeug.wsmarketyp}
				required="true"
			/>
		</div>
	{:else}
		<div></div>
		<div></div>
	{/if}
	<div>{texte.chassisnr[lang]}</div>
	<div>
		<input
			class="chassisnr"
			class:invalid={invalidchassisnr}
			type="text"
			bind:value={fahrzeug.chassisnr}
			required="true"
		/>
	</div>
	<div>{texte.stammnr[lang]}</div>
	<div>
		<input
			class:invalid={invalidstammnr}
			type="text"
			bind:value={fahrzeug.stammnr}
			required="true"
		/>&#160;&#160;&#160;&#160;
		{#if fahrzeug && fahrzeug.stammnr && fahrzeug.stammnr.length == 11 && !stammnrValid()}
			<span>&#160;</span>
			<span class="invalid">{texte.stammnrInvalid[lang]}</span>
		{/if}
	</div>
	<div>{texte.typenschein[lang]}</div>
	<div>
		<input class:invalid={invalidtypenschein}
        type="text" bind:value={fahrzeug.typenschein} required="true" />
	</div>
	<div>{texte.leasing[lang]}</div>
	<div>
		<select bind:value={fahrzeug.leasing} required="true">
			{#each janein as art}
				<option value={art.id}>{art.value}</option>
			{/each}
		</select>
	</div>
	<!--
    {#if !fzValid}
        <div>??????????????????????????????</div>
    {/if}
-->
</div>

<style>
	select.ivgrund{
		width: 240px;
	}
	.axa {
		background-color: rgb(160, 160, 209);
	}
	.other {
		background-color: rgb(151, 130, 172);
	}

	input.kennzeichen {
		width: 6rem;
	}
	/*
    select:invalid,
	input:invalid,
	input.invalid {
		background-color: rgb(0, 247, 255);
		color: var(--input-invalid-color);
		border: 1pt solid rgb(99, 99, 99);
	}
*/
	.span4 {
		grid-column: 1 / span 4;
	}

	.chassisnr {
		width: 170px;
	}
	.fett {
		font-weight: bold;
	}
	.r12 {
		grid-column: 1 / span 2;
	}
	.r14 {
		grid-column: 1 / span 4;
		border: 1pt;
	}
	.r34 {
		grid-column: 3 / span 2;
		border: 1pt;
	}

	.floatinginfo {
		position: absolute;
		left: 1150px;
		top: 280px;
		z-index: 5;
		width: 220px;
		color: red;
	}
</style>
