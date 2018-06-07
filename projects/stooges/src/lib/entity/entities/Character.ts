import { User } from './User';
import { forwardRef } from '@angular/core';
import { Key } from '../../decorators/Key';
import { ForeignKey } from '../../decorators/ForeignKey';
import { Resource } from '../../decorators/Resource';
import { Entity } from '../../types';


export abstract class Character implements Entity {

    @Key()
    Id: number = 0;

    @ForeignKey('user')
    userId: number;

    @Resource(forwardRef(() => User))
    user: User;
}

