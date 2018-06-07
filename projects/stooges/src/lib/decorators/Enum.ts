import { METADATA_KEY } from './metadata-key';


export type EnumOption = { value: string, display?: string };

export class EnumMetadata {
    multiple = false;
    items: EnumOption[]

    constructor(data?: Partial<EnumMetadata>) {
        Object.assign(this, data);
    }
}
export function Enum(metadata?: Partial<EnumMetadata>) {
    return Reflect.metadata(METADATA_KEY.Enum, new EnumMetadata(metadata));
}