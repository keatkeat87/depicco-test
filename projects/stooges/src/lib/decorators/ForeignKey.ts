import { METADATA_KEY } from './metadata-key';


export class ForeignKeyMetadata {
    linkTo: string

    constructor(data?: Partial<ForeignKeyMetadata>) {
        Object.assign(this, data);
    }
}

export function ForeignKey(linkTo: string) {
    return Reflect.metadata(METADATA_KEY.ForeignKey, new ForeignKeyMetadata({ linkTo }));
}