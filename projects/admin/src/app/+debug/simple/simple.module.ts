import { NgModule } from '@angular/core';
import { SimpleComponent } from './simple.component';
import { TestComponent } from './test/test.component';
import { SimpleRoutingModule } from './simple-routing.module';

@NgModule({
  imports: [
    SimpleRoutingModule
  ],
  declarations: [SimpleComponent, TestComponent]
})
export class SimpleModule { }
