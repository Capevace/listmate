import { createStylesServer, getSSRStyles } from '@mantine/ssr';

const server = createStylesServer();

export function injectStylesIntoStaticMarkup(markup: string) {
	return markup.replace('</body>', `${getSSRStyles(markup, server)}</body>`);
}
