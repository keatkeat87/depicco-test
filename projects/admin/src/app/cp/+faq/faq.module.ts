import { NgModule } from '@angular/core';

import { FAQPostFormComponent } from './faq-form/faq-post-form.component';
import { FAQPutFormComponent } from './faq-form/faq-put-form.component';
import { FAQRoutingModule } from './faq-routing.module';
import { FAQComponent } from './faq.component';
import { 
  CommonModule, MatInputModule, MatTableModule, MatSimpleSelectModule, FormModule, MatDynamicAccessorModule, EntityModule, MatConfirmDialogModule
 } from '../../../../../stooges/src/public_api';
import { HeaderModule } from '../../shared/header/header.module';
import { MatCardModule, MatProgressSpinnerModule, MatIconModule, MatButtonModule } from '@angular/material';
import { PaginationModule } from '../../shared/pagination/pagination.module';

@NgModule({
  imports: [
    FAQRoutingModule,
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
    FAQComponent,
    FAQPostFormComponent,
    FAQPutFormComponent
  ]
})
export class FAQModule { }

