import { NgModule } from '@angular/core';

import { ProductPostFormComponent } from './product-form/product-post-form.component';
import { ProductPutFormComponent } from './product-form/product-put-form.component';
import { ProductRoutingModule } from './product-routing.module';
import { ProductComponent } from './product.component';
import { 
  CommonModule, MatInputModule, MatTableModule, MatSimpleSelectModule, FormModule, MatDynamicAccessorModule, EntityModule, MatConfirmDialogModule
 } from '../../../../../stooges/src/public_api';
import { HeaderModule } from '../../shared/header/header.module';
import { MatCardModule, MatProgressSpinnerModule, MatIconModule, MatButtonModule } from '@angular/material';
import { PaginationModule } from '../../shared/pagination/pagination.module';

@NgModule({
  imports: [
    ProductRoutingModule,
    CommonModule,
    MatInputModule,
    HeaderModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatSimpleSelectModule,
    PaginationModule,
    MatIconModule,
    FormModule,
    MatDynamicAccessorModule,
    EntityModule,
    MatConfirmDialogModule,
    MatButtonModule
  ],
  declarations: [
    ProductComponent,
    ProductPostFormComponent,
    ProductPutFormComponent
  ]
})
export class ProductModule { }

