import { forwardRef } from '@angular/core';
import { PostService } from './Post.service';
import { Required, ImageDecorator, Ckeditor, Service, Key, UrlTitle, DateDecorator, Textarea, Unique, SImage, Entity  } from '../../../../../stooges/src/public_api';

@Service(forwardRef(() => PostService))
export class Post implements Entity {

    static entityName = 'Posts';
    static className = 'Post';
    

    constructor(data?: Partial<Post>) {
        Object.assign(this, data);
    }

    @Key()
    Id: number = 0;

    @Required()
    @ImageDecorator({
        aspectRatio: '32:17',
        scenes: {
            'homePost,upload': '402w, 480w, 402w',
            'posts,post': '402w, 651w, 835w'
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
    @DateDecorator()
    publishedDate: Date = new Date();

    @Required()
    author: string = '';

    @Required()
    @Textarea()
    summary: string = '';

    @Required()
    @Ckeditor()
    description: string = ''; 
}
