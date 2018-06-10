import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EventComponent } from './event.component';
import { NonVirtualRunEventPostFormComponent } from './event-form/non-virtual-run-event-post-form.component';
import { VirtualRunEventPostFormComponent } from './event-form/virtual-run-event-post-form.component';
import { NonVirtualRunEventPutFormComponent } from './event-form/non-virtual-run-event-put-form.component';
import { VirtualRunEventPutFormComponent } from './event-form/virtual-run-event-put-form.component';

@NgModule({
  imports: [RouterModule.forChild([
    {
      path: '',
      component: EventComponent,
      children: [
        {
          path: 'create-NonVirtualRunEvent',
          component: NonVirtualRunEventPostFormComponent
        },
        {
          path: 'create-VirtualRunEvent',
          component: VirtualRunEventPostFormComponent
        },
        {
          path: ':Id/edit-NonVirtualRunEvent',
          component: NonVirtualRunEventPutFormComponent
        },
        {
          path: ':Id/edit-VirtualRunEvent',
          component: VirtualRunEventPutFormComponent
        }
      ]
    }
  ])],
  exports: [RouterModule]
})
export class EventRoutingModule { }
