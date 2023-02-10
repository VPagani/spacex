export function formatDate(date: Date, language = navigator.languages[0] ?? navigator.language) {
	const formatter = new Intl.DateTimeFormat(language, {
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	return formatter.format(date);
}

export function formatUnixTimestamp(timestamp: number, language?: string) {
	return formatDate(new Date(timestamp * 1000), language);
}
