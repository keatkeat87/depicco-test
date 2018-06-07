import { METADATA_KEY } from './metadata-key';


export class UrlTitleMetadata {
    linkTo: string
    constructor(data?: Partial<UrlTitleMetadata>) {
        Object.assign(this, data);
    }
}
export function UrlTitle(linkTo: string) {
    return Reflect.metadata(METADATA_KEY.UrlTitle, new UrlTitleMetadata({ linkTo }));
}