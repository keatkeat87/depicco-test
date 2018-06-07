import { METADATA_KEY } from './metadata-key';


export function Required() {
    return Reflect.metadata(METADATA_KEY.Required, null);
}