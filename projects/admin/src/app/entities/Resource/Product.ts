import { forwardRef } from '@angular/core';
import { ProductService } from './Product.service';
import { Required, Service, Key, Sort, ImageDecorator, SImage, Unique, UrlTitle, Amount, Textarea, Ckeditor, Entity } from '../../../../../stooges/src/public_api';

@Service(forwardRef(() => ProductService))
export class Product implements Entity {

    static entityName = 'Products';
    static className = 'Product';
    

    constructor(data?: Partial<Product>) {
        Object.assign(this, data);
    }

    @Key()
    Id: number = 0;

    @Required()
    @ImageDecorator({
        aspectRatio: '1:1',
        scenes: {
            'homeProduct,upload': '402w, 510w, 402w',
            'product,productDetail': '402w, 402w, 510w'
        },
        multiple : true
    })
    images: SImage[] = [];

    @Unique()
    @Required()
    title: string = '';

    @Unique()
    @Required()
    @UrlTitle('title')
    urlTitle: string = '';

    @Amount()
    @Required()
    amount : number = null!;

    @Required()
    @Textarea()
    summary: string = '';

    @Required()
    @Ckeditor()
    description: string = '';

    @Sort()
    sort: number = 0; 
}
