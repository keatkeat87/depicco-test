import { Constructor } from '../types';
import { METADATA_KEY } from './metadata-key';

export class ResourcesMetadata {
    getConstructor: () => Constructor;

    constructor(data: Partial<ResourcesMetadata>) {
        Object.assign(this, data);
    }
}
export function Resources(getConstructorMethod: any) {
    return Reflect.metadata(METADATA_KEY.Resources, new ResourcesMetadata({
        getConstructor(): Constructor {
            return getConstructorMethod();
        }
    }));
}