import { METADATA_KEY } from './metadata-key';


export class MinMetadata {
    min: number
    equal: boolean
    constructor(data: Partial<MinMetadata>) {
        Object.assign(this, data);
    }
}

export function Min(min: number, equal = true) {
    return Reflect.metadata(METADATA_KEY.Min, new MinMetadata({ min, equal }));
}