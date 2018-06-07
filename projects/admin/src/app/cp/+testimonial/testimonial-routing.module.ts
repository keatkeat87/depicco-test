import { TestimonialComponent } from './testimonial.component';
import { TestimonialPutFormComponent } from './testimonial-form/testimonial-put-form.component';
import { TestimonialPostFormComponent } from './testimonial-form/testimonial-post-form.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: '',
            component: TestimonialComponent,
            children: [
                {
                    path: 'create',
                    component: TestimonialPostFormComponent
                },
                {
                    path: ':Id/edit',
                    component: TestimonialPutFormComponent
                }
            ]
        }
    ])],
    exports: [RouterModule]
})
export class TestimonialRoutingModule { }
