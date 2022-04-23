import type { MantineThemeOverride } from '@mantine/core';
import { DEFAULT_THEME } from '@mantine/core';
import { fixColors, zinc, blue, green, teal } from './tailwind-colors';

// Set mantine to use tailwind colors
export const theme: MantineThemeOverride = {
	...DEFAULT_THEME,
	fontFamily: 'inherit',
	headings: {
		fontWeight: '700',
	},
	fontFamilyMonospace:
		'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
	defaultRadius: 'md',
	colorScheme: 'dark',
	primaryColor: 'blue',
	colors: {
		gray: fixColors(zinc),
		// dark: fixColors(z, true),
		blue: fixColors(blue),
		green: fixColors(green),
		teal: fixColors(teal),
	},
};
