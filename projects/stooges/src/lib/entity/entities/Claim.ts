import { Key } from "../../decorators/Key";
import { Type } from "../../decorators/Type";
import { Entity } from "../../types";

export class Claim implements Entity {
    
    @Key()
    Id: number;

    @Type()
    UserId: number;

    @Type()
    ClaimType: string;

    @Type()
    ClaimValue: string;
}
