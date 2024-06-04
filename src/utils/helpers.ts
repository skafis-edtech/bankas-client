export function generateGUID(): string {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		const r = (Math.random() * 16) | 0;
		const v = c === 'x' ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
}

/**
 * Increments the numerical part of the input string by 1 and the given index.
 * @param {string} inputStr - The input string in the format "SKF-{number}".
 * @param {number} index - The index number to add to the {number}.
 * @returns {string} The modified string in the format "SKF-{number + 1 + index}".
 */
export function genSkfId(lastUsedSkfCode: string, index: number): string {
	// Extract the numerical part of the input string
	const prefix = lastUsedSkfCode.substring(0, 4); // Assuming the prefix is always "SKF-"
	const numberPart = lastUsedSkfCode.substring(4);

	// Convert the numerical part to a number, increment it by 1 and the index
	const incrementedNumber = parseInt(numberPart) + 1 + index;

	// Return the modified string
	return `${prefix}${incrementedNumber}`;
}

export const isUrl = (path: string): boolean => path.startsWith('https');
