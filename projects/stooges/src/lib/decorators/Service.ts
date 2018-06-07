import { Constructor } from '../types';
import { METADATA_KEY } from './metadata-key';


export class ServiceMetadata {
    getConstructor: () => Constructor;

    constructor(data: Partial<ServiceMetadata>) {
        Object.assign(this, data);
    }
}
export function Service(getConstructorMethod: any) {
    return Reflect.metadata(METADATA_KEY.Service, new ServiceMetadata({
        getConstructor(): Constructor {
            return getConstructorMethod();
        }
    }));
}