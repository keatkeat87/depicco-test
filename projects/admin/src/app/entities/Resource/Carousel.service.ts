import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { EntityConfig, ENTITY_CONFIG, EntityService, AbstractResourceService, HttpWatcher } from '../../../../../stooges/src/public_api';
import { Carousel } from './Carousel';

@Injectable({ providedIn : 'root' })
export class CarouselService extends AbstractResourceService<Carousel> {
    constructor(
        http: HttpClient,
        entityService: EntityService,
        httpWatcher: HttpWatcher,
        @Inject(ENTITY_CONFIG) entityConfig: EntityConfig
    ) {
        super(http, entityService, Carousel, httpWatcher, entityConfig);
    }
}
