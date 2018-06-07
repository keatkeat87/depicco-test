import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { EntityConfig, ENTITY_CONFIG, EntityService, AbstractResourceService, HttpWatcher } from '../../../../../stooges/src/public_api';

import { Post } from './Post';

@Injectable({ providedIn : 'root' })
export class PostService extends AbstractResourceService<Post> {
    constructor(
        http: HttpClient,
        entityService: EntityService,
        httpWatcher: HttpWatcher,
        @Inject(ENTITY_CONFIG) entityConfig: EntityConfig
    ) {
        super(http, entityService, Post, httpWatcher, entityConfig);
    }
}
