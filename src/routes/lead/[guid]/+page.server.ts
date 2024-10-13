import type { PageServerLoad } from "./$types";
import type Comp from "./Comp.svelte";

const cars = false
const prod = true
export const load: PageServerLoad = async ({ params }) => {
    let leads
    if (cars) {
        leads = [
            {
                "gd": "2D8AF61E-92C0-4877-AC24-AEBDAEE258FD",
                "guid": "2D8AF61E-92C0-4877-AC24-AEBDAEE258FD",
                "agent": "GCS",
                "service": true,
                "whitelabel": true,
                "stamp": "2024-09-16T14:10:03.513Z",
                "vertragnr": "33126",
                "user_anredeid": 2,
                "user_vorname": "Alessia",
                "user_nachname": "Mazzotta",
                "user_email": "alessia.mazzotta@autokunz.ch",
                "user_telefon": "056 619 71 51",
                "garage_idkey": "AUTOKUNZ",
                "partnerversicherung": null,
                "garage_firma": "Auto Kunz AG",
                "garage_email": "info@autokunz.ch",
                "garage_anredeid": 1,
                "garage_vorname": "",
                "garage_nachname": "Auto Kunz AG",
                "garage_strasse": "Bremgartenstrasse 75 + 38",
                "garage_hausnummer": " ",
                "garage_plz": "5610",
                "garage_ort": "Wohlen",
                "garage_spracheid": 2,
                "firmaname": null,
                "isfirma": false,
                "anredeid": 2,
                "vorname": "Monika",
                "nachname": "Krasznai",
                "strasse": "Forhaldenstrasse 22",
                "hausnummer": " ",
                "plz": "8636",
                "ort": "Wald ZH",
                "geburtstag": "1968-01-19T00:00:00.000Z",
                "geburtstagunbekannt": false,
                "spracheid": 1,
                "email": "monik.krasznai@gmail.com",
                "telefonm": "0765139904",
                "telefong": "",
                "telefonp": "0765139904",
                "kanton": "ZH",
                "kennzeichen": "neu",
                "quelle": "custom",
                "fzart": 0,
                "fzkey": "77197",
                "invsetz": "2013-12-18T00:00:00.000Z",
                "typenschein": "1MA920",
                "marke": "MAZDA",
                "modell": "CX-5 2.0 Ambition AWD",
                "typ": "CX-5",
                "getriebe": "Schaltgetriebe",
                "aufbau": "Geländewagen",
                "antrieb": "Allradantrieb",
                "treibstoff": "Benzin",
                "hubraum": 1998,
                "tueren": 5,
                "sitzplatz": 5,
                "ps": 160,
                "kw": 118,
                "chassisnr": "JMZKEK97600231327",
                "stammnr": "556.318.130",
                "katalogpreis": 35700,
                "preiszubehoer": 1500,
                "kilometer": 54259,
                "leasing": false,
                "agentid": "5682",
                "id": 176603,
                "tick": "1726488603513",
                "halteranredeid": 2,
                "halteranrede": "Frau",
                "haltername": "Monika Krasznai",
                "halteradresse": "Forhaldenstrasse 22  ",
                "halterplz": "8636",
                "halterort": "Wald ZH",
                "standortanredeid": 0,
                "standortanrede": null,
                "standortname": "",
                "standortadresse": "",
                "standortplz": null,
                "standortort": "",
                "versicherung": "AXA",
                "agentur": "",
                "ivgrund": "Neueinlösung (Code 57)",
                "vnab": "2024-10-01T00:00:00.000Z",
                "nationalitaet": "Ungarn (HU)",
                "trans": "whitelabel",
                "bemerkungen": "",
                "ws": false,
                "wsmarketyp": "",
                "evnsent": "2024-10-01T09:26:25.000Z",
                "evnemail": "zuerich.city@axa.ch\r\n",
                "evntelefon": "+41 44 209 61 61\r\n",
                "abgabedatum": "2024-09-30T00:00:00.000Z",
                "vvbfill": null,
                "leergewicht": 0,
                "gesamtgewicht": 0,
                "freiegaragenwahl": false,
                "kundenfilterpass": null,
                "kundenfilter": null,
                "verkaeuferok": null,
                "popup": null,
                "evnok": "2024-10-02T17:33:21.800Z",
                "preiszusatzzubehoer": 0,
                "dispo_email": "alessia.mazzotta@autokunz.ch",
                "evnok_code": 0
            }
        ]
        console.log(leads)
    } else {
        const url = !prod ? `http://localhost:3344/rawGuid?guid=${params.guid}` : `https://api.car-ware.ch/rawGuid?guid=${params.guid}`
        //        console.log(url)
        const resp = await fetch(url)
        leads = await resp.json();
    }
    const baseUrlS = prod ? 'https://api.car-ware.ch/' : 'http://127.0.0.1:3344/';

    //    console.log(leads)
    if (leads.length) {
        let rawLead = leads[0]
        const urlL = !prod ? `http://localhost:3344/mailboxlog?guid=${params.guid}` : `https://api.car-ware.ch/mailboxlog?guid=${params.guid}`
        //        console.log(url)
        const respL = await fetch(urlL)
        const mailboxlogs = await respL.json();
        if (mailboxlogs.length) {
            rawLead.evnstatus = 2
            rawLead.mailboxlog = mailboxlogs[0]
        } else {
            rawLead.evnstatus = 1
            rawLead.mailboxlog = {}
        }

        rawLead.vnab = rawLead.vnab?.substring(0, 10)
        rawLead.geburtstag = rawLead.geburtstag?.substring(0, 10)
        console.log(rawLead.vnab)
        console.log(rawLead.geburtstag)
        console.log('rawLead', rawLead.garage_idkey)
        if (rawLead.garage_idkey == 'AUTOKUNZ') {
            const url = baseUrlS + 'disponentEVN'
            console.log('disponentenUrl', url)
            let p = await fetch(url)
            let disponenten = await p.json();
            console.log('disponenten', disponenten)
            disponenten = disponenten.filter((d) => !d.hidden);
            disponenten.map((d) => (d.bezeichnung = d.vorname + ' ' + d.nachname));
            rawLead.disponenten = [...disponenten]
        } else {
            rawLead.disponenten = []
        }
        //lead.halter = {}
        let halter = {}
        if (rawLead.haltername) {
            halter.anredeid = rawLead.halteranredeid;
            halter.anrede = rawLead.halteranrede;
            halter.name = rawLead.haltername;
            halter.adresse = rawLead.halteradresse;
            halter.plz = rawLead.halterplz;
            halter.ort = rawLead.halterort;
            rawLead.halter = halter
            let standort = {}
            standort.anredeid = rawLead.standortanredeid;
            standort.anrede = rawLead.standortanrede;
            standort.name = rawLead.standortname;
            standort.adresse = rawLead.standortadresse;
            standort.plz = rawLead.standortplz;
            standort.ort = rawLead.standortort;
            rawLead.standort = standort
        } else {
            halter.anredeid = rawLead.anredeid;
            halter.anrede = rawLead.anrede;
            halter.name = rawLead.vorname + ' ' + rawLead.nachname;
            halter.adresse = rawLead.strasse + ' ' + rawLead.hausnummer;
            halter.plz = rawLead.plz;
            halter.ort = rawLead.ort;
            rawLead.halter = halter
            let standort = {}
            rawLead.standort = standort

        }
//        console.log('rawLead', rawLead)
        return rawLead;
    } else {
        return {}
    }

};