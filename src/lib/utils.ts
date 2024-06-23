export const getNiceTimeString = (date: string | null) => {
	return (
		new Date(date || '').toLocaleDateString('lt-LT') +
		' ' +
		new Date(date || '').toLocaleTimeString('lt-LT')
	);
};
