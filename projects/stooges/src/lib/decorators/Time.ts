import { METADATA_KEY } from './metadata-key';


export function Time() {
    return Reflect.metadata(METADATA_KEY.Time, null);
}