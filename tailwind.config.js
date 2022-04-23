const colors = require('tailwindcss/colors');

module.exports = {
	content: ['./app/**/*.{ts,tsx,jsx,js}'],
	theme: {
		extend: {
			colors: {
				theme: colors.zinc,
			},
		},
	},
	plugins: [],
};
