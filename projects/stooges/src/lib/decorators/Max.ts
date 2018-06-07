import { METADATA_KEY } from './metadata-key';


export class MaxMetadata {
    max: number
    equal: boolean
    constructor(data: Partial<MaxMetadata>) {
        Object.assign(this, data);
    }
}

export function Max(max: number, equal = true) {
    return Reflect.metadata(METADATA_KEY.Max, new MaxMetadata({ max, equal }));
}