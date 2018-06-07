import { Constructor } from '../types';
import { METADATA_KEY } from './metadata-key';

export class ResourceMetadata {
    getConstructor: () => Constructor;
    constructor(data: Partial<ResourceMetadata>) {
        Object.assign(this, data);
    }
}
export function Resource(getConstructorMethod: any) {
    return Reflect.metadata(METADATA_KEY.Resource, new ResourceMetadata({
        getConstructor(): Constructor {
            return getConstructorMethod();
        }
    }));
}