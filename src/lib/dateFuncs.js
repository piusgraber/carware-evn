// Define the timezone for GMT+2 that respects daylight saving (like 'Europe/Berlin')
const options = {
	timeZone: 'Europe/Berlin', // Adjust this according to the region using GMT+2
	year: 'numeric',
	month: '2-digit',
	day: '2-digit',
	hour: '2-digit',
	minute: '2-digit',
	second: '2-digit',
	hour12: false
};

export const localTime = date => {
	if (!date) return '';
	let str = new Date(date).toLocaleString('de-CH', options);	
	return str.substring(0, 10) + ' ' + str.substring(12, 17) 
}
