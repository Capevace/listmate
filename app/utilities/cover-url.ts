import type { Resource } from '~/models/resource/types';

export default function composeCoverUrl(resource: Resource): string | null {
	return resource.thumbnail ? `/media/${resource.thumbnail.id}` : null;
}
