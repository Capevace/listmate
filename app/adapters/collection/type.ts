import type {
	DataSchema,
	ListData,
	SourceTypeData,
	TextData,
	ValueMode,
} from '~/models/resource/refs';
import { Schemas } from '~/models/resource/refs';
import type {
	Resource,
	ResourceDetails,
	ResourceType,
} from '~/models/resource/types';
import { ValueType } from '~/models/resource/types';

export type CollectionData = {
	name: TextData;
	description: TextData;
	source: SourceTypeData;
	items: ListData;
};

export const CollectionDataSchema: DataSchema<CollectionData> = {
	name: Schemas[ValueType.TEXT]().min(1), // title is required
	description: Schemas[ValueType.TEXT]().optional(),
	source: Schemas[ValueType.SOURCE_TYPE]().optional(),
	items: Schemas[ValueType.LIST]().optional(),
};

export type Collection<
	TResourceType extends ResourceType = ResourceType.COLLECTION
> = Resource<TResourceType, CollectionData>;

export type CollectionDetails<TResource extends Resource = Resource> =
	ResourceDetails & {
		items: TResource[];
	};
