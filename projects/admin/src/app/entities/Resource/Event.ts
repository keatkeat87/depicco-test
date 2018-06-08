import { forwardRef } from '@angular/core';
import { EventService } from './Event.service';
import { Required, Service, Key, Sort, ImageDecorator, SImage, Unique, UrlTitle, Amount, Textarea, Ckeditor, DateDecorator, Abstract, Entity } from '../../../../../stooges/src/public_api';

@Abstract()
@Service(forwardRef(() => EventService))
export class Event implements Entity {

    static entityName = 'Events';
    static className = 'Event';

    constructor(data?: Partial<Event>) {
        Object.assign(this, data);
    }

    @Key()
    Id: number = 0;

    @Required()
    @ImageDecorator({
        aspectRatio: '32:17',
        scenes: {
            'homeEvent,upload': '402w, 480w, 402w',
            'event': '402w, 651w, 835w',
        }
    })
    image: SImage = null!;

    @Unique()
    @Required()
    title: string = '';

    @Unique()
    @Required()
    @UrlTitle('title')
    urlTitle: string = '';

    @Required()
    @Textarea()
    summary: string = '';

    @Required()
    @Ckeditor()
    description: string = '';

    @Required()
    @DateDecorator()
    registerDeadline: Date = null!;

    @Required()
    @DateDecorator()
    startRunDate: Date = null!;

    @Required()
    @DateDecorator()
    endRunDate: Date = null!;

    @Amount()
    @Required()
    registerAmount: number = null!;

    @Required()
    participant: number = null!;

    @Required()
    googleFormLink: string = '';

    @Sort()
    sort: number = 0;
}
