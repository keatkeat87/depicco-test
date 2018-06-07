import { NgModule } from '@angular/core';

import { VirtualRunEventPostFormComponent } from './virtual-run-event-form/virtual-run-event-post-form.component';
import { VirtualRunEventPutFormComponent } from './virtual-run-event-form/virtual-run-event-put-form.component';
import { VirtualRunEventRoutingModule } from './virtual-run-event-routing.module';
import { VirtualRunEventComponent } from './virtual-run-event.component';
import {
  CommonModule, MatInputModule, MatTableModule, MatSimpleSelectModule, FormModule, MatDynamicAccessorModule, EntityModule, MatConfirmDialogModule
} from '../../../../../stooges/src/public_api';
import { HeaderModule } from '../../shared/header/header.module';
import { MatCardModule, MatProgressSpinnerModule, MatIconModule, MatButtonModule } from '@angular/material';
import { PaginationModule } from '../../shared/pagination/pagination.module';

@NgModule({
  imports: [
    VirtualRunEventRoutingModule,
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
    VirtualRunEventComponent,
    VirtualRunEventPostFormComponent,
    VirtualRunEventPutFormComponent
  ]
})
export class VirtualRunEventModule { }

