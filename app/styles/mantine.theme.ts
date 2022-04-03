import type { MantineThemeOverride } from '@mantine/core';
import { DEFAULT_THEME } from '@mantine/core';
import { fixColors, gray, blue, green, teal } from './tailwind-colors';

// Set mantine to use tailwind colors
export const theme: MantineThemeOverride = {
	...DEFAULT_THEME,
	defaultRadius: 'md',
	colorScheme: 'dark',
	primaryColor: 'blue',
	colors: {
		gray: fixColors(gray),
		blue: fixColors(blue),
		green: fixColors(green),
		teal: fixColors(teal),
	},
};
