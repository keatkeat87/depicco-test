import { NgModule } from '@angular/core';

import { NonVirtualRunEventPostFormComponent } from './non-virtual-run-event-form/non-virtual-run-event-post-form.component';
import { NonVirtualRunEventPutFormComponent } from './non-virtual-run-event-form/non-virtual-run-event-put-form.component';
import { NonVirtualRunEventRoutingModule } from './non-virtual-run-event-routing.module';
import { NonVirtualRunEventComponent } from './non-virtual-run-event.component';
import {
  CommonModule, MatInputModule, MatTableModule, MatSimpleSelectModule, FormModule, MatDynamicAccessorModule, EntityModule, MatConfirmDialogModule
} from '../../../../../stooges/src/public_api';
import { HeaderModule } from '../../shared/header/header.module';
import { MatCardModule, MatProgressSpinnerModule, MatIconModule, MatButtonModule } from '@angular/material';
import { PaginationModule } from '../../shared/pagination/pagination.module';

@NgModule({
  imports: [
    NonVirtualRunEventRoutingModule,
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
    NonVirtualRunEventComponent,
    NonVirtualRunEventPostFormComponent,
    NonVirtualRunEventPutFormComponent
  ]
})
export class NonVirtualRunEventModule { }

