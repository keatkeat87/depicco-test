import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { EntityConfig, ENTITY_CONFIG, EntityService, AbstractResourceService, HttpWatcher } from '../../../../../stooges/src/public_api';
import { VirtualRunEvent } from './VirtualRunEvent';

@Injectable({ providedIn : 'root' })
export class VirtualRunEventService extends AbstractResourceService<VirtualRunEvent> {
    constructor(
        http: HttpClient,
        entityService: EntityService,
        httpWatcher: HttpWatcher,
        @Inject(ENTITY_CONFIG) entityConfig: EntityConfig
    ) {
        super(http, entityService, VirtualRunEvent, httpWatcher, entityConfig);
    }
}
