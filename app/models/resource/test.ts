import { SerializationMode } from './types';

type ResourceValues<Data, mode extends SerializationMode> = {
	[key in keyof Data]: mode extends SerializationMode.DESERIALIZED ? Data[key];
};

interface SongData extends ResourceData {}

export interface Resource {
	id: string;
	title: string;
}
