import { CarouselComponent } from './carousel.component';
import { CarouselPutFormComponent } from './carousel-form/carousel-put-form.component';
import { CarouselPostFormComponent } from './carousel-form/carousel-post-form.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: '',
            component: CarouselComponent,
            children: [
                {
                    path: 'create',
                    component: CarouselPostFormComponent
                },
                {
                    path: ':Id/edit',
                    component: CarouselPutFormComponent
                }
            ]
        }
    ])],
    exports: [RouterModule]
})
export class CarouselRoutingModule { }
