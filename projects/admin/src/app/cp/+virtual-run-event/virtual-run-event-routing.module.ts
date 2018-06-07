import { VirtualRunEventComponent } from './virtual-run-event.component';
import { VirtualRunEventPutFormComponent } from './virtual-run-event-form/virtual-run-event-put-form.component';
import { VirtualRunEventPostFormComponent } from './virtual-run-event-form/virtual-run-event-post-form.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: '',
            component: VirtualRunEventComponent,
            children: [
                {
                    path: 'create',
                    component: VirtualRunEventPostFormComponent
                },
                {
                    path: ':Id/edit',
                    component: VirtualRunEventPutFormComponent
                }
            ]
        }
    ])],
    exports: [RouterModule]
})
export class VirtualRunEventRoutingModule { }
