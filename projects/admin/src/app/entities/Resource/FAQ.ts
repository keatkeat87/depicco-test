import { forwardRef } from '@angular/core';
import { FAQService } from './FAQ.service';
import { Required, Service, Key, Sort, LongText, Textarea, Entity } from '../../../../../stooges/src/public_api';

@Service(forwardRef(() => FAQService))
export class FAQ implements Entity {

    static entityName = 'FAQs';
    static className = 'FAQ';
    
    constructor(data?: Partial<FAQ>) {
        Object.assign(this, data);
    }

    @Key()
    Id: number = 0;

    @Required()
    @LongText()
    question: string = '';

    @Required()
    @Textarea()
    answer: string = '';

    @Sort()
    sort: number = 0;
}
