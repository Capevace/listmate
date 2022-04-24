import type { MantineThemeOverride } from '@mantine/core';
import { DEFAULT_THEME } from '@mantine/core';
import { fixColors, gray, red, blue, green, teal } from './tailwind-colors';

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
		gray: fixColors(gray),
		dark: fixColors(gray, true),
		blue: fixColors(blue),
		red: fixColors(red),
		green: fixColors(green),
		teal: fixColors(teal),
	},
};
