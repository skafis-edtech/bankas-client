export function generateGUID(): string {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		const r = (Math.random() * 16) | 0;
		const v = c === 'x' ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
}

export function normalizeString(input: string): string {
	return input
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[čČ]/g, 'c')
		.replace(/[šŠ]/g, 's')
		.replace(/[žŽ]/g, 'z')
		.replace(/[ąĄ]/g, 'a')
		.replace(/[ęĘ]/g, 'e')
		.replace(/[ėĖ]/g, 'e')
		.replace(/[įĮ]/g, 'i')
		.replace(/[ųŲ]/g, 'u')
		.replace(/[ūŪ]/g, 'u')
		.toLowerCase();
}
