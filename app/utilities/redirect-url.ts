import type { SourceType } from '~/models/resource/types';

export default function composeSourceRedirectUrl(type: SourceType) {
	return `${process.env.APP_URL}/connections/${type}/oauth`;
}
