import { CompareType } from "../types";
import { METADATA_KEY } from './metadata-key';

export class CompareMetadata {
    linkTo: string
    type : CompareType    
    constructor(data?: Partial<CompareMetadata>) {
        Object.assign(this, data);
    }
}

export function Compare(type : CompareType, linkTo : string) {
    return Reflect.metadata(METADATA_KEY.Compare, new CompareMetadata({ type, linkTo }));
}