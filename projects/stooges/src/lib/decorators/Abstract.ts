import { METADATA_KEY } from './metadata-key';
 
export function Abstract() {
    return Reflect.metadata(METADATA_KEY.Abstract, null);
}