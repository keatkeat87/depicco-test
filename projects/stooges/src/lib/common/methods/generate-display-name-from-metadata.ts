import { EntityConstructor } from '../../types';
import { DisplayNameMetadata } from '../../decorators/DisplayName';
import { METADATA_KEY } from '../../decorators/metadata-key';
import { valueToDisplay } from './value-to-display';

export function generateDisplayNameFromMetadata(target: EntityConstructor, formOrTable: 'form' | 'table'): string
export function generateDisplayNameFromMetadata(target: Object, formOrTable: 'form' | 'table', key: string): string
export function generateDisplayNameFromMetadata(target: EntityConstructor | Object, formOrTable: 'form' | 'table', key?: string): string {
    let metadataKey = (formOrTable == 'form') ? METADATA_KEY.FormDisplayName : METADATA_KEY.TableDisplayName;
    let displayNameMetadata: DisplayNameMetadata = (key === undefined) ?
        (Reflect.getMetadata(metadataKey, target) || Reflect.getMetadata(METADATA_KEY.DisplayName, target)) :
        (Reflect.getMetadata(metadataKey, target, key) || Reflect.getMetadata(METADATA_KEY.DisplayName, target, key));
    let keyOrClassName = (key === undefined) ? (target as EntityConstructor).className : key;
    return displayNameMetadata ? displayNameMetadata.name : valueToDisplay(keyOrClassName, 'spaceFirstUpper');
}