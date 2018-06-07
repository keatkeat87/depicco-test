import { NgModule } from '@angular/core';

import { PostPostFormComponent } from './post-form/post-post-form.component';
import { PostPutFormComponent } from './post-form/post-put-form.component';
import { PostRoutingModule } from './post-routing.module';
import { PostComponent } from './post.component';
import { 
  CommonModule, MatInputModule, MatTableModule, MatSimpleSelectModule, FormModule, MatDynamicAccessorModule, EntityModule, MatConfirmDialogModule
 } from '../../../../../stooges/src/public_api';
import { HeaderModule } from '../../shared/header/header.module';
import { MatCardModule, MatProgressSpinnerModule, MatIconModule, MatButtonModule } from '@angular/material';
import { PaginationModule } from '../../shared/pagination/pagination.module';

@NgModule({
  imports: [
    PostRoutingModule,
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
    PostComponent,
    PostPostFormComponent,
    PostPutFormComponent
  ]
})
export class PostModule { }

