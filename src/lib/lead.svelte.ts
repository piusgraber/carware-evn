export function createLead() {
    let leadData = $state({})
    function set(_lead) {
        leadData =_lead
    }
    return {
        get lead() {
            return leadData
        },
        set
    }
}


export const lead = createLead()