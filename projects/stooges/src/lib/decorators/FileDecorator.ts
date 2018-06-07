import { METADATA_KEY } from './metadata-key';


export class FileMetadata {
    constructor(data?: Partial<FileMetadata>) {
        Object.assign(this, data);
    }

    serverUrl = '/api/uploadFile';
    onlyExtensions: string[] | null;
    exceptExtensions: string[] | null; //['.jpg']
    maxSize: number | null = null //kb
    multiple = false;
}

export function FileDecorator(metadata?: Partial<FileMetadata>) {
    return Reflect.metadata(METADATA_KEY.File, new FileMetadata(metadata));
}