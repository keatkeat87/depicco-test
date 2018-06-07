import { NgModule } from '@angular/core';
import { DebugComponent } from './debug.component';
import { DebugRoutingModule } from './debug-routing.module';

@NgModule({
  imports: [
    DebugRoutingModule
  ],
  declarations: [DebugComponent]
})
export class DebugModule { }
