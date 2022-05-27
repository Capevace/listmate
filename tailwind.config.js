const colors = require('tailwindcss/colors');

module.exports = {
	content: ['./app/**/*.{ts,tsx,jsx,js}'],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				theme: colors.slate,
				gray: colors.slate,
			},
		},
	},
	plugins: [require('@tailwindcss/forms')],
};
