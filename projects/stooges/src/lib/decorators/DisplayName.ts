import { METADATA_KEY } from './metadata-key';


export class DisplayNameMetadata {
    name: string
    constructor(data?: Partial<DisplayNameMetadata>) {
        Object.assign(this, data);
    }
}

export function DisplayName(name: string) {
    return Reflect.metadata(METADATA_KEY.DisplayName, new DisplayNameMetadata({ name }));
}
export function TableDisplayName(name: string) {
    return Reflect.metadata(METADATA_KEY.TableDisplayName, new DisplayNameMetadata({ name }));
}
export function FormDisplayName(name: string) {
    return Reflect.metadata(METADATA_KEY.FormDisplayName, new DisplayNameMetadata({ name }));
}