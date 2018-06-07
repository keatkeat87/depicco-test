import { METADATA_KEY } from './metadata-key';


export function DateDecorator() {
    return Reflect.metadata(METADATA_KEY.Date, null);
}