<script>
	import { onMount } from 'svelte';

    import Evn from './Evn.svelte';
	import Comp from './Comp.svelte';
	import Adresse from './Adresse.svelte';
	import { lead } from '$lib/lead.svelte';

	let data = $state({});
	onMount(async () => {
		const dt  = await fetchdata();
		let h = {}
		h.anredeid = dt.halteranredeid;
		h.name = dt.haltername;
		h.adresse = dt.halteradresse;
		h.plz = dt.halterplz;
		h.ort = dt.halterort;
        console.log('dttt', dt)
        dt.halter = h
        dt.standort = h

        lead.set(dt)
		//        console.log(data)
	});

	const fetchdata = async () => {
		const resp = await fetch(
			'https://api.car-ware.ch/rawGuid?guid=6f8f5c30-7b4b-439d-b971-16d47ccabc60'
		);
		const leads = await resp.json();
		//        console.log(lead)
        let lead = leads[0]
        //lead.halter = {}
		return lead;
	};

	$effect(() => {
		//        data = fetchdata()
		$inspect('dt', lead.lead);
	});
//	let halter = $state({ name: 'Pius', plz: 0 });
//	let standort = $state({ name: 'Pius' });
	let halterPlzValid = $state(true);
	let standortPlzValid = $state(false);



	const prod = true;
	const baseUrlS = prod ? 'https://api.car-ware.ch/' : 'http://127.0.0.1:3344/';
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
				alert(err); // Failed to fetch
				return false;
			}
		} else {
			return false;
		}
	};

	$effect(() => {
		// Define an inner async function
		const runCheck = async () => {
			if (true) {
				halterPlzValid = await checkPlzL(lead.lead.kanton, lead.lead.halter.plz);
				standortPlzValid = await checkPlzL(lead.lead.kanton, lead.lead.standort.plz);
			}
		};
		runCheck();
	});
</script>





<hr/>
<h1>Lead</h1>
{JSON.stringify(lead.lead)}
<hr/>
{JSON.stringify(lead.lead.halter)}
<hr/>
{JSON.stringify(lead.lead.standort)}
<hr/>
Kanton: <input type="text" bind:value={lead.lead.kanton} />
<div>
    <Evn ></Evn>
</div>
<div>
</div>
<div>
	{#if lead?.lead?.halter}
	<Adresse title="Halter" bind:adresse={lead.lead.halter} lang="de" plzValid={halterPlzValid}></Adresse>
	{/if}
</div>
{#if !halterPlzValid}
	<div>
		<Adresse title="Halter" bind:adresse={lead.lead.standort} lang="de" plzValid={standortPlzValid}></Adresse>
	</div>
{/if}
