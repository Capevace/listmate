import type { MinLength } from '@deepkit/type';
import type { Data, RefWithRequiredKey } from '~/models/resource/refs';
import type {
	Resource,
	ResourceType,
	ValueType,
} from '~/models/resource/types';

type TitleValue = string & MinLength<1>;

export type SongData = {
	name: Data<TitleValue, ValueType.TEXT>;
	artist: Data<TitleValue, ValueType.TEXT, RefWithRequiredKey<'title'>>;
	album: Data<TitleValue, ValueType.TEXT, RefWithRequiredKey<'title'>>;
};

export type Song = Resource<ResourceType.SONG, SongData>;
