export const __getFullTitle = episode => {
	if (episode && episode.attributes) {
		const appendix = episode.attributes.part ? ` (${episode.attributes.part}/${episode.attributes.mirroredSerial.totalParts})` : ''
		return episode.attributes.title + appendix
	}
	else return '—'
}

export const __secondsToHms = sec => {
	const s = Math.round(sec)

	let hours = ((s - s % 3600) / 3600) % 60
	const minutes = ((s - s % 60) / 60) % 60
	const seconds = (s % 60).toString().padStart(2, '0')
	
	hours = hours ? hours+':' : ''
	return `${hours}${minutes}:${seconds}`
}

export const __sanitizeText = str => {
	return str.replace(/<\/?[^>]+(>|$)|&.*;/g, "")
}