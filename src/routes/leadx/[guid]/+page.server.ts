import type { PageServerLoad } from "./$types";
import type Comp from "./Comp.svelte";

export const load: PageServerLoad = async ({params}) => {
    const url=    `http://localhost:3344/rawGuid?guid=${params.guid}` //  `https://api.car-ware.ch/rawGuid?guid=${params.guid}`
    console.log(url)
    const resp = await fetch(url)
    const leads = await resp.json();
//    console.log(leads)
    if (leads.length) {
        let rawLead = leads[0]
        //lead.halter = {}
        let halter = {}
		halter.anredeid = rawLead.halteranredeid;
		halter.name = rawLead.haltername;
		halter.adresse = rawLead.halteradresse;
		halter.plz = rawLead.halterplz;
		halter.ort = rawLead.halterort;
        rawLead.halter = halter
        let standort = {}
		standort.anredeid = rawLead.standortanredeid;
		standort.name = rawLead.standortname;
		standort.adresse = rawLead.standortadresse;
		standort.plz = rawLead.standortplz;
		standort.ort = rawLead.standortort;
        rawLead.standort = standort
        rawLead.standort = standort

        console.log(rawLead)
        return rawLead;
    } else {
        return {}
    }
    
};