import { NgModule } from '@angular/core';

import { EventRoutingModule } from './event-routing.module';
import { EventComponent } from './event.component';
import {
  CommonModule, MatInputModule, MatTableModule, MatSimpleSelectModule, FormModule, MatDynamicAccessorModule, EntityModule, MatConfirmDialogModule
} from '../../../../../stooges/src/public_api';
import { HeaderModule } from '../../shared/header/header.module';
import { MatCardModule, MatProgressSpinnerModule, MatIconModule, MatButtonModule, MatMenuModule } from '@angular/material';
import { PaginationModule } from '../../shared/pagination/pagination.module';
import { NonVirtualRunEventPostFormComponent } from './event-form/non-virtual-run-event-post-form.component';
import { NonVirtualRunEventPutFormComponent } from './event-form/non-virtual-run-event-put-form.component';
import { VirtualRunEventPostFormComponent } from './event-form/virtual-run-event-post-form.component';
import { VirtualRunEventPutFormComponent } from './event-form/virtual-run-event-put-form.component';

@NgModule({
  imports: [
    EventRoutingModule,
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
    MatButtonModule,
    MatMenuModule
  ],
  declarations: [
    EventComponent,
    NonVirtualRunEventPostFormComponent,
    NonVirtualRunEventPutFormComponent,
    VirtualRunEventPostFormComponent,
    VirtualRunEventPutFormComponent
  ]
})
export class EventModule { }

