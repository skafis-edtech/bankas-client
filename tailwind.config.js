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
					700: '#EB4F27',
				}
			}
		}
	},
	/* 
	 Stuff below removes all the default styles so that freshly made h1 and p tags would have at least a bit difference :D
	 For now the solution is reset.css file 
	 */
	// corePlugins: {
	// 	preflight: false,
	// },
};
