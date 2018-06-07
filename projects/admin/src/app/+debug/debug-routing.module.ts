import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DebugComponent } from './debug.component';

@NgModule({
  imports: [RouterModule.forChild([
    {
      path: '',
      component: DebugComponent,
      children: [
        { path: '', pathMatch: 'full', redirectTo: 'events' }, 
        { path: 'events', loadChildren: './event/event.module#EventModule' },
        { path: 'simple', loadChildren: './simple/simple.module#SimpleModule' }
      ]
    },
  ])],
  exports: [RouterModule],
})
export class DebugRoutingModule { }
