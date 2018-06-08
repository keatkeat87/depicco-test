import { forwardRef } from '@angular/core';
import { CarouselService } from './Carousel.service';

import { ImageDecorator, Required, SImage, Key, Service, LongText, Sort, Type, Entity } from '../../../../../stooges/src/public_api';

@Service(forwardRef(() => CarouselService))
export class Carousel implements Entity {

    static entityName = 'Carousels';
    static className = 'Carousel';

    constructor(data?: Partial<Carousel>) {
        Object.assign(this, data);
    }

    @Key()
    Id: number = 0;

    @Required()
    @ImageDecorator({
        aspectRatio: '16:10',
        scenes: {
            'home,upload': '420w, -, -'
        }
    })
    image_mobile: SImage = null!;

    @Required()
    @ImageDecorator({
        aspectRatio: '16:9',
        scenes: {
            'home,upload': '-, 1024w, 1366w'
        }
    })
    image_pc: SImage = null!;

    @Type()
    title1: string = '';

    @Type()
    title2: string = '';

    @LongText()
    description: string = '';

    @Type()
    linkText: string = '';

    @Type()
    link: string = '';

    @Sort()
    sort: number = 0;
}
