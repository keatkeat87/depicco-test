import { METADATA_KEY } from './metadata-key';
 
export function Email() {
    return Reflect.metadata(METADATA_KEY.Email, null);
}
