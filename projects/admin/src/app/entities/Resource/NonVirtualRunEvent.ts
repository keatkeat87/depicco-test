import { forwardRef } from '@angular/core';
import { NonVirtualRunEventService } from './NonVirtualRunEvent.service';
import { Required, Service, Time, Extends, DisplayName } from '../../../../../stooges/src/public_api';
import { Event } from './Event';

@DisplayName('Non Virtual Run')
@Extends(forwardRef(() => Event))
@Service(forwardRef(() => NonVirtualRunEventService))
export class NonVirtualRunEvent extends Event {

    static entityName = 'NonVirtualRunEvents';

    constructor(data?: Partial<NonVirtualRunEvent>) {
        super();
        Object.assign(this, data);
    }

    @Required()
    location: string = '';

    @Time()
    @Required()
    startRunTime: Date = null!;

    @Time()
    @Required()
    endRunTime: Date = null!; 
}
