import { METADATA_KEY } from './metadata-key';


export class RangeMetadata {
    min: number
    max: number
    equal: boolean
    constructor(data: Partial<RangeMetadata>) {
        Object.assign(this, data);
    }
}

export function Range(min: number, max: number, equal = true) {
    return Reflect.metadata(METADATA_KEY.Range, new RangeMetadata({ min, max, equal }));
}