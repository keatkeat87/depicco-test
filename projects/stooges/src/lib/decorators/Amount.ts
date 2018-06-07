import { METADATA_KEY } from './metadata-key';
 
export function Amount() {
    return Reflect.metadata(METADATA_KEY.Amount, null);
}