<script lang="ts">
    	import { texte } from '$lib/texte';

	import { lead } from '$lib/lead.svelte';
	import Adresse from './Adresse.svelte';
	import Evn from './Evn.svelte';
	import EvnStatus from './EvnStatus.svelte';
	let { data } = $props();
    data.sprache = data.garage_spracheid==2 ? 'fr' : data.garage_spracheid==3 ? 'it' : 'de'
	lead.set(data);
	const rawLead = lead.lead;
	let halterValid = $state(true);
	let standortValid = $state(true);
	let evnValid = $state(true);
	// Prüfung der PLZ mit Ort

    let showData = $state(false)
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


const mail = rawLead.mailboxlog?.mailcontent //`Guten Tag<br/><br/>Im Zusammenhang mit der Bestellung des Versicherungsnachweis für:<br/><br/><u>Fahrzeug:</u>&#160;&#160;&#160;&#160;<b>Ford Puma 1.0 EcoB Hybrid 125 ST-Line X</b>, Stammnummer: <b>672.488.310</b><br/><u>Halter:</u>&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;<b>Th. Willy AG Auto-Zentrum, Freiburgstrasse 443, 3018 Bern</b><br/><br/>haben wir von der Versicherung <b>Zurich</b> folgende Nachricht für Sie erhalten<br/>(siehe unten)<br/><br/>Beste Grüsse<br/><br/>Ihre CARWARE<br/><br/><br/><span style="font-size: calc(100% - 2pt);">Sie erhalten diese Nachricht, weil Sie den eVn Service der CARWARE genutzt haben.<br/>Falls Sie keine weiteren Emails der CARWARE erhalten möchten, klicken Sie hier: <a href="https://api.car-ware.ch/unsubscribe_evn?email=manuel.hofer@thwilly.ch">unsubscribe</a></span><br/><br/><hr/><br/><br/><p>Guten Tag</p><p>Wir haben den gew&uuml;nschten Versicherungsnachweis erstellt und an das zust&auml;ndige Strassenverkehrsamt &uuml;bermittelt.<br/>Freundliche gr&uuml;sse</p><p>Clara Sofia Barbosa Lopes</p><p>Kauffrau in Ausbildung</p><p>[cid:image001.png@01DB1A66.E6688F00]<br/>Zurich, Generalagemtur Roland &amp;Scheidegger AG<br/>[cid:image002.png@01DB1A66.E6688F00]<br/>Bern Stadt<br/>[cid:image002.png@01DB1A66.E6688F00]<br/>Eigerstrasse 2, CH-3007 Bern<br/>[cid:image003.png@01DB1A66.E6688F00]<br/>+41 31 970 40 50<br/>[cid:image004.png@01DB1A66.E6688F00]<br/><a href='mailto:clara.barbosa@zurich.ch'>clara.barbosa@zurich.ch</a></p><p>[<a href='https://www.zurich.com/-/media/project/zurich/dotcom/services/images/email/zurich_logo.png'>https://www.zurich.com/-/media/project/zurich/dotcom/services/images/email/zurich_logo.png</a>]&lt;<a href='https://zurich.com/'>https://zurich.com/</a>&gt;</p><p>&quot;******************* BITTE BEACHTEN ******************* Diese Nachricht (wie auch allf&auml;llige Anh&auml;nge dazu) beinhaltet m&ouml;glicherweise vertrauliche oder gesetzlich gesch&uuml;tzte Daten oder Informationen. Zum Empfang derselben ist (sind) ausschliesslich die genannte(n) Person(en) bestimmt. Falls Sie diese Nachricht irrt&uuml;mlicherweise erreicht hat, sind Sie h&ouml;flich gebeten, diese unter Ausschluss jeder Reproduktion zu zerst&ouml;ren und die absendende Person umgehend zu benachrichtigen. Vielen Dank f&uuml;r Ihre Hilfe.&quot;</p><p>Confidential  Personal Data</p>`
let showMail = $state(false)


const toggleShowMail = () => {
	showMail = !showMail
}

</script>

<div class="gridevnheader">
    <div class="evnheader"><img style="height: 40px" src="images/eVnBestellungCWLogo.png" alt="evn-logo" /></div>
    <div class="evnheader">    {texte.header[rawLead.sprache]}
    </div>

</div>
{#if !showMail}

{#if !rawLead.evnsent}
<Evn rawLead={rawLead} lang={rawLead.sprache}></Evn>
{:else}
<EvnStatus bind:showMail= {showMail} status = {rawLead.evnstatus}></EvnStatus>
{/if}
<div class="gridevnfooter">
<div class="r12 btop">

</div>
    
    <div class="footer">
        <u>{texte.fragen[rawLead.sprache]}</u><br/>
        {texte.fragen2[rawLead.sprache]}
    </div>
    <div>
                <img style="height: 60px" src="images/SWLogoCWeVn.png" alt="evn-logo" /></div>

            </div>

            {#if showData}
            {JSON.stringify(rawLead)}
            {/if}

			{:else}
			<div><button class="submitsmall" on:click={toggleShowMail}>schliessen</button><br/><br/></div>
			{@html mail}
			{/if}
<style>
    	.r12 {
		grid-column: 1 / span 2;
	}

    .grid {
        display: grid;
        grid-template-columns: 590px 590px;
    }
	div.invalid {
		background-color: #ff98fa;
	}
</style>

