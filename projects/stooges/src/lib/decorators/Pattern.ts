import { METADATA_KEY } from './metadata-key';


export class PatternMetadata {
    pattern: string | RegExp;
    constructor(data: Partial<PatternMetadata>) {
        Object.assign(this, data);
    }
}
export function Pattern(pattern: string | RegExp) {
    return Reflect.metadata(METADATA_KEY.Pattern, new PatternMetadata({
        pattern
    }));
}