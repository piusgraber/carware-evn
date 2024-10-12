<script>
	import { texte } from '$lib/texte.js';

	let { choosenAgent = null, agentid = $bindable(0), sprache = null } = $props();
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
		choosenAgent = null;
		agentid = 0;
	};
</script>

<div>
	{#if choosenAgent}
		<div>
			<span>&#160;&#160;&#160;&#160;&#160;&#160;&#160;</span><b>{choosenAgent}</b>
			<span>&#160;&#160;</span><span class="link" onclick={doEdit} onkeydown={() => {}} tabindex="0" role="button"
				>&#160;[{texte.aendern[sprache]}]&#160;</span
			>
		</div>
	{:else}
		<div class="grid">
			<div>
				<input type="text" bind:value={srch} required="true" /><br />
				{texte.sucheHlp[sprache]}<br />
			</div>
			<div class="r12">
				<select class="broad" size="6" bind:value={agentid}>
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
	select.broad {
		width: 350px;
	}
</style>
