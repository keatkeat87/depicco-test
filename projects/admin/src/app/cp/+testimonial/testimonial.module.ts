import { NgModule } from '@angular/core';

import { TestimonialPostFormComponent } from './testimonial-form/testimonial-post-form.component';
import { TestimonialPutFormComponent } from './testimonial-form/testimonial-put-form.component';
import { TestimonialRoutingModule } from './testimonial-routing.module';
import { TestimonialComponent } from './testimonial.component';
import { 
  CommonModule, MatInputModule, MatTableModule, MatSimpleSelectModule, FormModule, MatDynamicAccessorModule, EntityModule, MatConfirmDialogModule
 } from '../../../../../stooges/src/public_api';
import { HeaderModule } from '../../shared/header/header.module';
import { MatCardModule, MatProgressSpinnerModule, MatIconModule, MatButtonModule } from '@angular/material';
import { PaginationModule } from '../../shared/pagination/pagination.module';

@NgModule({
  imports: [
    TestimonialRoutingModule,
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
    TestimonialComponent,
    TestimonialPostFormComponent,
    TestimonialPutFormComponent
  ]
})
export class TestimonialModule { }

