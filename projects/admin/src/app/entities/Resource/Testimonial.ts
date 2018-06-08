import { SImage, ImageDecorator, Required, Service, Key, Sort, Textarea, Entity } from '../../../../../stooges/src/public_api';
import { TestimonialService } from './Testimonial.service';
import { forwardRef } from '@angular/core';

@Service(forwardRef(() => TestimonialService))
export class Testimonial implements Entity {

    static entityName = 'Testimonials';
    static className = 'Testimonial';
    

    constructor(data?: Partial<Testimonial>) {
        Object.assign(this, data);
    }

    @Key()
    Id: number = 0;

    @Required()
    @ImageDecorator({
        aspectRatio: '1:1',
        scenes: {
            'avatar,upload': '130w, 150w, 180w',
            'testimonial': '412w, 504w, 412w'
        }
    })
    avatar: SImage = null!;

    @Required()
    name: string = '';

    @Required()
    designation: string = '';

    @Required()
    @Textarea()
    description: string = ''; 
 
    @Sort()
    sort: number = 0;
}
