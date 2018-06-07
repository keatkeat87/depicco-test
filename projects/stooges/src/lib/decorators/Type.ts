import { METADATA_KEY } from './metadata-key';


export function Type() {
    return Reflect.metadata(METADATA_KEY.Type, null);
}