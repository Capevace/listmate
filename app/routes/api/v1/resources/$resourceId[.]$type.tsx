import { LoaderFunction, json } from 'remix';
import findResource from '~/utilities/http/find-resource';
import { Resource, ValueType } from '~/models/resource/types';
import { getFileUrl } from '~/models/file.server';
import { composeShortResourceUrl } from '~/utilities/resource-url';

type ExportableResource = Resource & {
	thumbnail: Resource['thumbnail'] & {
		url: string;
	} | null;
}

async function composePDFResponse(resource: ExportableResource) {

};

function composeResourceXML(resource: ExportableResource) {
	let valuesXML = [];

	for (const [key, valueRef] of Object.entries(resource.values)) {
		if (!valueRef) {
			continue;
		} else if (Array.isArray(valueRef)) {
			const subXML = [];
			for (const arrayValueRef of valueRef) {
				subXML.push(`<resource-ref id="${escapeXMLAttribute(arrayValueRef.ref ?? '')}" url="${arrayValueRef.url}">
				${escapeXMLAttribute(arrayValueRef.value?.toString())}
			</resource-ref>`);
			}
			valuesXML.push(`<${key} type="resource-list">
			${subXML.join('\n\t\t\t')}
		</${key}>`);
		} else {
			valuesXML.push(`<${key} type="${escapeXMLAttribute(valueRef.type)}"${valueRef.ref ? ` ref="${valueRef.ref}" url="${valueRef.url}"` : ''}>
			${escapeXMLAttribute(valueRef.value?.toString())}
		</${key}>`);
		}
	}

	let remotesXML = [];

	for (const [sourceType, uri] of Object.entries(resource.remotes)) {
		remotesXML.push(`<${sourceType}>${escapeXMLAttribute(uri)}</${sourceType}>`);
	}

	return `<?xml version="1.0" encoding="utf-8"?>
<resource id="${escapeXMLAttribute(resource.id)}" type="${escapeXMLAttribute(resource.type)}" title="${escapeXMLAttribute(resource.title)}" is-favourite="${resource.isFavourite}">
	${resource.thumbnail
		? `<thumbnail id="${escapeXMLAttribute(resource.thumbnail.id)}" mime-type="${escapeXMLAttribute(resource.thumbnail.mimeType)}" url="${escapeXMLAttribute(resource.thumbnail.url)}" />`
		: ''
	}
	<values>
		${valuesXML.join('\n\t\t')}
	</values>
	<remotes>
		${remotesXML.join('\n\t\t')}
	</remotes>
</resource>`;
}

function escapeXMLAttribute(str: string) {
	return str
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

async function composeXMLResponse(resource: ExportableResource) {
	return new Response(composeResourceXML(resource), { 
		headers: {
			'Content-Type': 'text/xml'
		}
	})
};

async function composeJSONResponse(resource: ExportableResource) {
	return json({
		resource
	});
}

function composeExportableResource(resource: Resource, { baseUrl, extension }: { baseUrl: string, extension: string }): ExportableResource {
	let exportableResource = { ...resource } as ExportableResource;

	if (exportableResource.thumbnail) {
		exportableResource.thumbnail.url = `${baseUrl}${getFileUrl(exportableResource.thumbnail.id)}`;
	}

	for (const [valueKey, value] of Object.entries(exportableResource.values)) {
		if (!value)
			continue;

		if (Array.isArray(value)) {
			for (const index in value) {
				const arrayRef = value[index];

				if (arrayRef.type === ValueType.RESOURCE && arrayRef.ref && !arrayRef.url) {
					arrayRef.url = `${baseUrl}/api/v1${composeShortResourceUrl(arrayRef.ref)}.${extension}`;
				}
			}
		} else if (value.type === ValueType.RESOURCE && value.ref && !value.url) {
			value.url = `${baseUrl}/api/v1${composeShortResourceUrl(value.ref)}.${extension}`;
		}
	}

	return exportableResource;
}

export const loader: LoaderFunction = async ({ request, params }) => {
	const resource = await findResource(params.resourceId);

	if (!resource) {
		throw new Response('Resource not found', { status: 404 });
	}

	const extension = String(params.type).toLowerCase();

	if (!['pdf', 'json', 'xml'].includes(extension)) {
		throw new Response('Unsupported export filetype', { status: 400 });
	}

	const hostUrl = new URL(request.url);
	const exportableResource: ExportableResource = composeExportableResource(resource, { baseUrl: `${hostUrl.protocol}//${hostUrl.host}`, extension });

	switch (extension) {
		case 'pdf':
			return composePDFResponse(exportableResource);
		case 'json':
			return composeJSONResponse(exportableResource);
		case 'xml':
			return composeXMLResponse(exportableResource);
		default:
			throw new Response('Unsupported export filetype', { status: 400 });
	}
};
