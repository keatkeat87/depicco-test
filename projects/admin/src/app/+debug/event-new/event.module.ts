import { NgModule } from '@angular/core';

import { EventRoutingModule } from './event-routing.module';
import { EventComponent } from './event.component';
import {
  CommonModule, MatInputModule, MatTableModule, MatSimpleSelectModule, FormModule, MatDynamicAccessorModule, EntityModule, MatConfirmDialogModule
} from '../../../../../stooges/src/public_api';
import { HeaderModule } from '../../shared/header/header.module';
import { MatCardModule, MatProgressSpinnerModule, MatIconModule, MatButtonModule, MatMenuModule } from '@angular/material';
import { PaginationModule } from '../../shared/pagination/pagination.module';
import { MatCPCreateModule } from './cp/create/create.module';
import { MatCPInputSearchModule } from './cp/input-search/input-search.module';
import { MatCPPaginationModule } from './cp/pagination/pagination.module';
import { MatCPRowPerPageModule } from './cp/row-per-page/row-per-page.module';
import { MatCPSelectEntitiesModule } from './cp/select-entities/select-entities.module';
import { MatCPSelectLanguagesModule } from './cp/select-languages/select-languages.module';
import { MatCPTableModule } from './cp/table/table.module';

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
    MatMenuModule,
    MatCPCreateModule,
    MatCPInputSearchModule,
    MatCPPaginationModule,
    MatCPRowPerPageModule,
    MatCPSelectEntitiesModule,
    MatCPSelectLanguagesModule,
    MatCPTableModule
  ],
  declarations: [
    EventComponent
  ]
})
export class EventModule { }

