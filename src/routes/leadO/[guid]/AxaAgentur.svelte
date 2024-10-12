<script>
    let {sprache = null, verkaeuferAxaAgent = $bindable({choice: 0})} = $props();
//    export let verkaeuferTempAxaAgent = {};


    import AxaLoc from "./AxaLoc.svelte";
    import { texte } from "$lib/texte.js";
    
    let agentur = {};  // gewählte Agentur für diesen Lead

    let edit = true;

    // Anzeige für gewählten Agent
    let choosenAgent = null;
    let onceChoosenAgent = null;

    $effect(() => {
        if (sprache) {
            getVerkaeuferAgent();
        }
    })
    let axaAgents = [];

    const saveVerkaeuferAxaAgent = async () => {
        if (saving) {
            return; 
        }
        saving = true;
        verkaeuferAxaAgent.useagent = verkaeuferAxaAgent.choice;
        if (!verkaeuferAxaAgent.temp) {
            verkaeuferAxaAgent.temp = 0;
        }
        // request options
        const options = {
            method: "POST",
            body: JSON.stringify(verkaeuferAxaAgent),
            headers: {
                "Content-Type": "application/json",
            },
        };
        const options2 = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        try {
            const fetchResponse = await fetch(
                "https://api.car-ware.ch/saveVerkaeuferAxaAgent",
//                "http://127.0.0.1:3344/saveVerkaeuferAxaAgent",
                options
            );
            const data = await fetchResponse.json();
            console.log(data); //200
        } catch (err) {
            console.log(err);
        }
//        await new Promise(resolve => setTimeout(resolve, 1000));
        saving = false;
    };

    let savedVerkaeuferAxaAgent = {choice: 0};
    const getVerkaeuferAgent = async () => {
        try {
            const url =
                  "https://api.car-ware.ch/verkaeuferAxaAgent?email=" +
//                "http://127.0.0.1:3344/verkaeuferAxaAgent?email=" +
                verkaeuferAxaAgent.verkaeuferemail;
            //        const url = "http://127.0.0.1:3344/axaagentur?srch=" + srch
            let d = await fetch(url);
            let p = d.json();
            p.then((d) => {
                if (d.length) {
                    verkaeuferAxaAgent.choice = d[0].useagent;
                    verkaeuferAxaAgent.axaagentid = d[0].axaagentid;
                    if (verkaeuferAxaAgent.choice==2) {
                        if (verkaeuferAxaAgent.axaagentid != 0) {
                            verkaeuferAxaAgent.choice = 1;
                        } else {
                            verkaeuferAxaAgent.choice = 0;
                        }
                        verkaeuferAxaAgent.temp = 0;
                        saveChoice();
                    }
//                    verkaeuferAxaAgent.temp = d[0].temp;
                } else {
                    // noch kein Eintrag
                    verkaeuferAxaAgent.choice = 0;
                    verkaeuferAxaAgent.axaagentid = 0;
                    verkaeuferAxaAgent.temp = 0;
                    saveChoice();
                }
                savedVerkaeuferAxaAgent.choice =  verkaeuferAxaAgent.choice;
                savedVerkaeuferAxaAgent.axaagentid = verkaeuferAxaAgent.axaagentid;
                savedVerkaeuferAxaAgent.temp =  verkaeuferAxaAgent.temp;
            });
        } catch (err) {
//            alert(err); // Failed to fetch
        }
    };

    const saveChoice = () => {
        saveVerkaeuferAxaAgent();
    };
    const cancelChoice = () => {
        edit = false;
    };
    const makeChoice = () => {
        edit = true;
    };

    let saving = false;

    $effect(()=> {
        if (savedVerkaeuferAxaAgent.choice != null && 
        (savedVerkaeuferAxaAgent.choice != verkaeuferAxaAgent.choice ||
        savedVerkaeuferAxaAgent.axaagentid != verkaeuferAxaAgent.axaagentid ||
        savedVerkaeuferAxaAgent.temp != verkaeuferAxaAgent.temp )
            ) {
           saveVerkaeuferAxaAgent();
        }
    })

    let scoops = 1;


let infolink = "https://car-ware.ch/info-agenturauswahl_" + sprache;    

</script>

{#if edit}
    <!-- editor anzeigen -->
    <table>
        <tbody>
        <tr>
            <td class="info link">
                <a href={infolink} target="_blank"><img class="info" alt="info" src="images/info.png"/></a></td>
            <td>
                <div class="lbl nos" class:high={verkaeuferAxaAgent.choice==0}>
                    <label
                        ><input
                            type="radio"
                            bind:group={verkaeuferAxaAgent.choice}
                            name="choice"
                            value={0}
                            on:change="{saveVerkaeuferAxaAgent}"
                        />
                        {texte.axaPartnerChoiceKfz[sprache]}
                    </label>
                </div>
                <div class="lbl nos" class:high={verkaeuferAxaAgent.choice==1}>
                    <label
                        ><input
                            type="radio"
                            bind:group={verkaeuferAxaAgent.choice}
                            name="choice"
                            value={1}
                        />
                        {texte.axaPartnerChoiceAgent[sprache]}
                    </label>
                </div>
                {#if verkaeuferAxaAgent.choice == 1}
                <AxaLoc bind:agentid={verkaeuferAxaAgent.axaagentid} {sprache}/>
            
                {/if}
                <div class="lbl nos" class:high={verkaeuferAxaAgent.choice==2}>
                    <label
                        ><input
                            type="radio"
                            bind:group={verkaeuferAxaAgent.choice}
                            name="choice"
                            value={2}
                        />
                        {texte.axaPartnerChoiceOnce[sprache]}
                    </label>
                </div>
                {#if verkaeuferAxaAgent.choice == 2}
                <AxaLoc bind:agentid={verkaeuferAxaAgent.temp} {sprache}/>
                {/if}
            </td>
        </tr>
    </tbody>
    </table>
    {/if}
    <div>&#160;</div>

<style>

select:invalid, input:invalid,   input.invalid  {
    background-color: var(--input-invalid-bg-color);
    color: var(--input-invalid-color);
    border: 1pt solid rgb(99, 99, 99);
  }

  img.info {
        height: 45px;
    }
    td.info {
        vertical-align: top;
        padding-top:13px;
    }
    ::placeholder {
        /* Chrome, Firefox, Opera, Safari 10.1+ */
        color: rgba(255, 255, 255, 0.164);
        opacity: 0; /* Firefox */
    }

    .nos {
        user-select: none;
    }
    .lbl {
        padding: 2px 0px 2px 0px;
    }

    .high  {
        background-color: rgb(255, 246, 161);
    }
</style>
