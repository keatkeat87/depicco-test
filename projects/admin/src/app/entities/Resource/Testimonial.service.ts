import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { EntityConfig, ENTITY_CONFIG, EntityService, AbstractResourceService, HttpWatcher } from '../../../../../stooges/src/public_api';

import { Testimonial } from './Testimonial';

@Injectable({ providedIn : 'root' })
export class TestimonialService extends AbstractResourceService<Testimonial> {
    constructor(
        http: HttpClient,
        entityService: EntityService,
        httpWatcher: HttpWatcher,
        @Inject(ENTITY_CONFIG) entityConfig: EntityConfig
    ) {
        super(http, entityService, Testimonial, httpWatcher, entityConfig);
    }
}
