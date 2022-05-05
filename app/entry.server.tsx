import { renderToString } from 'react-dom/server';
import { RemixServer, RemixServerProps } from 'remix';
import { injectStylesIntoStaticMarkup } from '~/styles/inject-styles';

export default function handleRequest(
	request: Request,
	responseStatusCode: number,
	responseHeaders: Headers,
	remixContext: RemixServerProps['context']
) {
	const markup = renderToString(
		<RemixServer context={remixContext} url={request.url} />
	);

	responseHeaders.set('Content-Type', 'text/html');

	return new Response(
		'<!DOCTYPE html>' + injectStylesIntoStaticMarkup(markup),
		{
			status: responseStatusCode,
			headers: responseHeaders,
		}
	);
}
