import { forwardRef } from '@angular/core';
import { VirtualRunEventService } from './VirtualRunEvent.service';
import { Required, Service, Extends, DisplayName } from '../../../../../stooges/src/public_api';
import { Event } from './Event';

@DisplayName('Virtual Run')
@Extends(forwardRef(() => Event))
@Service(forwardRef(() => VirtualRunEventService))
export class VirtualRunEvent extends Event {

    static entityName = 'VirtualRunEvents';
    static className = 'VirtualRunEvent';    

    constructor(data?: Partial<VirtualRunEvent>) {
        super();
        Object.assign(this, data);
        
    }

    @Required()
    group: string = '';
}
