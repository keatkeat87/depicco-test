import { NgModule } from '@angular/core';

import { EventRoutingModule } from './event-routing.module';
import { EventComponent } from './event.component';
import {
  CommonModule, MatInputModule, MatTableModule, MatSimpleSelectModule, FormModule, MatDynamicAccessorModule, EntityModule, MatConfirmDialogModule
} from '../../../../../stooges/src/public_api';
import { HeaderModule } from '../../shared/header/header.module';
import { MatCardModule, MatProgressSpinnerModule, MatIconModule, MatButtonModule } from '@angular/material';
import { PaginationModule } from '../../shared/pagination/pagination.module';

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
    MatButtonModule
  ],
  declarations: [
    EventComponent
  ]
})
export class EventModule { }

