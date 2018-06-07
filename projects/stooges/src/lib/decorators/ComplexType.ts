import { Constructor } from '../types';
import { METADATA_KEY } from './metadata-key';


export class ComplexTypeMetadata {
    getConstructor: () => Constructor;
    constructor(data: Partial<ComplexTypeMetadata>) {
        Object.assign(this, data);
    }
}
export function ComplexType(getConstructorMethod: any) {
    return Reflect.metadata(METADATA_KEY.ComplexType, new ComplexTypeMetadata({
        getConstructor(): Constructor {
            return getConstructorMethod();
        }
    }));
}