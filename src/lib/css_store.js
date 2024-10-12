import { writable } from 'svelte/store';



export const styles = writable({
    modeImage: 'prooftransp',
    brandSrc: "transp.png",
    brandSrc2: "transp.png",
    lpBgColor: '#eeeeee',
    proofBgColor: '#eeeeee',
//    btnBgColor: '#ff9933',
//    btnDisabledBgColor: '#999999',
    inputInvalidColor: '#eeeeee'
});
