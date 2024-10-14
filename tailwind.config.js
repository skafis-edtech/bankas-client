/** @type {import('tailwindcss').Config} */
export default {
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'
	],
	plugins: [require('flowbite/plugin')],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				primary: {
					700: '#EB4F27'
				}
			}
			// borderRadius: {
			// 	// Override default Tailwind border-radius settings to remove rounded corners
			// 	none: '0px',
			// 	sm: '0px',
			// 	DEFAULT: '0px', // affects `rounded` class
			// 	md: '0px',
			// 	lg: '0px',
			// 	full: '0px'
			// }
		}
	}
};
