import { ODataType, ODataNameSpaceWithHash } from "./types";

export function getClassNameFromOdatTypeResource(resource: any): string {
    return (resource[ODataType] as string).replace(ODataNameSpaceWithHash, '');
}