import { Constructor } from '../types';
import { METADATA_KEY } from './metadata-key';

export class ExtendsMetadata {
    getConstructor: () => Constructor;
    constructor(data: Partial<ExtendsMetadata>) {
        Object.assign(this, data);
    }
}
export function Extends(getConstructorMethod: any) {
    return Reflect.metadata(METADATA_KEY.Extends, new ExtendsMetadata({
        getConstructor(): Constructor {
            return getConstructorMethod();
        }
    }));
}