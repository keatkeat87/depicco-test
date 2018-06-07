import { Key } from "../../decorators/Key";
import { Type } from "../../decorators/Type";
import { Entity } from "../../types";

export class Role implements Entity
{
    @Key()
    public Id: number;

    @Type()
    public Name: string;

    @Type()
    public disabled: boolean;
}
