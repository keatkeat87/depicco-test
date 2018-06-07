import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { EntityConfig, ENTITY_CONFIG, EntityService, AbstractResourceService, HttpWatcher } from '../../../../../stooges/src/public_api';
import { Event } from './Event';

@Injectable({ providedIn : 'root' })
export class EventService extends AbstractResourceService<Event> {
    constructor(
        http: HttpClient,
        entityService: EntityService,
        httpWatcher: HttpWatcher,
        @Inject(ENTITY_CONFIG) entityConfig: EntityConfig
    ) {
        super(http, entityService, Event, httpWatcher, entityConfig);
    }
}
