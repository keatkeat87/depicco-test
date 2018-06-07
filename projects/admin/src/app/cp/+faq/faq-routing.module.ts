import { FAQComponent } from './faq.component';
import { FAQPutFormComponent } from './faq-form/faq-put-form.component';
import { FAQPostFormComponent } from './faq-form/faq-post-form.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: '',
            component: FAQComponent,
            children: [
                {
                    path: 'create',
                    component: FAQPostFormComponent
                },
                {
                    path: ':Id/edit',
                    component: FAQPutFormComponent
                }
            ]
        }
    ])],
    exports: [RouterModule]
})
export class FAQRoutingModule { }
