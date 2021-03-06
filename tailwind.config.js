const colors = require('tailwindcss/colors');

module.exports = {
	content: ['./app/**/*.{ts,tsx,jsx,js}'],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				theme: colors.teal,
			},
		},
	},
	plugins: [require('@tailwindcss/forms')],
};
