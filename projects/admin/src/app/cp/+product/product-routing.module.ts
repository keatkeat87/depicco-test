import { ProductComponent } from './product.component';
import { ProductPutFormComponent } from './product-form/product-put-form.component';
import { ProductPostFormComponent } from './product-form/product-post-form.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: '',
            component: ProductComponent,
            children: [
                {
                    path: 'create',
                    component: ProductPostFormComponent
                },
                {
                    path: ':Id/edit',
                    component: ProductPutFormComponent
                }
            ]
        }
    ])],
    exports: [RouterModule]
})
export class ProductRoutingModule { }
