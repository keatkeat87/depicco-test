import { FileMetadata } from "./FileDecorator";
import { METADATA_KEY } from './metadata-key';

export class ImageMetadata extends FileMetadata {
    constructor(data?: Partial<ImageMetadata>) {
        super();
        Object.assign(this, data);
    }
    onlyExtensions: string[] = ['.jpg', '.jpeg'];
    aspectRatio: string | null = null; // 没有就放 value null
    haveUseOriginal = false;
    scenes: {
        [name: string]: string
    } = {}; // 给个 default 方便 Object.keys, 因为当 array 用嘛
}

export function ImageDecorator(metadata: Partial<ImageMetadata>) {
    return Reflect.metadata(METADATA_KEY.Image, new ImageMetadata(metadata));
}