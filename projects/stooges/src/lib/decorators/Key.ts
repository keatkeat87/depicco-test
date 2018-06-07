import { METADATA_KEY } from './metadata-key';


export function Key() {
    return Reflect.metadata(METADATA_KEY.Key, null);
}