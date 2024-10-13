<script>
	import { texte } from '$lib/texte.js';

	let { choosenAgent = null, agentid = $bindable(0), sprache = 'de' } = $props();
	let srch = $state('');
	$effect(() => {
		if (srch.length >= 1) {
			getAgents(srch);
		}
	});

	$effect(() => {
		if (agentid) {
			getAgent(agentid);
		}
	});

	let axaAgents = $state([]);

	const getAgents = async (srch) => {
		try {
			const url = 'https://api.car-ware.ch/axaagentur?srch=' + srch;
			//        const url = "http://127.0.0.1:3344/axaagentur?srch=" + srch
			console.log;
			let d = await fetch(url);
			let p = d.json();
			p.then((d) => {
				axaAgents = [...d];
			});
		} catch (err) {
			//            alert(err); // Failed to fetch
		}
	};

	const getAgent = async (id) => {
		try {
			const url = 'https://api.car-ware.ch/axaagentur?id=' + id;
			//        const url = "http://127.0.0.1:3344/axaagentur?srch=" + srch
			let d = await fetch(url);
			let p = d.json();
			p.then((d) => {
				if (d.length) {
					choosenAgent = d[0].ort + ', ' + d[0].anschrift + ' ' + d[0].name;
					agentid = d[0].id;
				}
			});
		} catch (err) {
			//alert(err); // Failed to fetch
		}
	};

	const doEdit = () => {
		choosenAgent = 0;
		agentid = 0;
	};
</script>

<div>
	{#if choosenAgent}
		<div>
			<span>&#160;&#160;&#160;&#160;&#160;&#160;&#160;</span><b>{choosenAgent}</b>
			<button  class="mini" on:click={doEdit}>{texte.aendern[sprache]}</button>

		</div>
	{:else}
		<div class="grid">
			<div>
				<input type="text" bind:value={srch} required="true" /><br />
				{texte.sucheHlp[sprache]}<br />
			</div>
			<div class="r12">
				<select class="broad" bind:value={agentid} size="6">
					{#each axaAgents as agent}
						<option value={agent.id}>{agent.ort}, {agent.anschrift} {agent.name}</option>
					{/each}
				</select>
			</div>
		</div>
	{/if}
</div>

<style>
	select:invalid,
	input:invalid,
	input.invalid {
		background-color: var(--input-invalid-bg-color);
		color: var(--input-invalid-color);
		border: 1pt solid rgb(99, 99, 99);
	}

	.grid {
		display: grid;
		grid-template-columns: 150px auto;
		grid-template-rows: repeat(30px);
	}
	.r12 {
		grid-row: 1 / 3;
		grid-column: 2 / 3;
	}




/* Class for the select with limited visible items and scrollbar */
select.broad {
    appearance: none;
    -webkit-appearance: none; /* For Safari/Chrome */
    -moz-appearance: none;    /* For Firefox */
    overflow-y: auto; /* Force the overflow property */
    height: 100px;
    width: 350px;
}
/* Optional: Style the scrollbar (for webkit browsers like Chrome and Safari) */
.broad::-webkit-scrollbar {
    width: 8px; /* Scrollbar width */
}

.broad::-webkit-scrollbar-thumb {
    background-color: #888; /* Scrollbar color */
    border-radius: 10px;
}

.scrollable-list {
  width: 250px;         /* Width of the container */
  max-height: 150px;    /* Limit the height of the container */
  overflow-y: auto;     /* Enable vertical scrolling */
  border: 1px solid #ccc; /* Optional: border for visibility */
  padding: 0;
  margin: 0;
}

.scrollable-list ul {
  list-style-type: none; /* Remove bullets */
  padding: 0;
  margin: 0;
}

.scrollable-list li {
  padding: 8px;          /* Space inside list items */
  border-bottom: 1px solid #ddd; /* Optional: border between items */
}

/* Optional: Style the scrollbar (for webkit browsers like Chrome and Safari) */
.scrollable-list::-webkit-scrollbar {
  width: 8px;
}

.scrollable-list::-webkit-scrollbar-thumb {
  background-color: #888; /* Scrollbar color */
  border-radius: 10px;
}

.scrollable-list::-webkit-scrollbar-thumb:hover {
  background-color: #555;
}

</style>
