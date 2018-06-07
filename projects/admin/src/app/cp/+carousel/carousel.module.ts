import { NgModule } from '@angular/core';

import { CarouselPostFormComponent } from './carousel-form/carousel-post-form.component';
import { CarouselPutFormComponent } from './carousel-form/carousel-put-form.component';
import { CarouselRoutingModule } from './carousel-routing.module';
import { CarouselComponent } from './carousel.component';
import { 
  CommonModule, MatInputModule, MatTableModule, MatSimpleSelectModule, FormModule, MatDynamicAccessorModule, EntityModule, MatConfirmDialogModule
} from '../../../../../stooges/src/public_api';
import { HeaderModule } from '../../shared/header/header.module';
import { PaginationModule } from '../../shared/pagination/pagination.module'
import { MatCardModule, MatProgressSpinnerModule, MatIconModule, MatButtonModule } from '@angular/material';

@NgModule({
  imports: [
    CarouselRoutingModule,
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
    MatButtonModule,
    EntityModule,
    MatConfirmDialogModule
  ],
  declarations: [
    CarouselComponent,
    CarouselPostFormComponent,
    CarouselPutFormComponent
  ],
  entryComponents : []
})
export class CarouselModule { }
