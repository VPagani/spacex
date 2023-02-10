export function formatDate(date: Date) {
	const formatter = new Intl.DateTimeFormat(navigator.languages[0] ?? navigator.language, {
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	return formatter.format(date);
}

export function formatUnixTimestamp(timestamp: number) {
	return formatDate(new Date(timestamp * 1000));
}
