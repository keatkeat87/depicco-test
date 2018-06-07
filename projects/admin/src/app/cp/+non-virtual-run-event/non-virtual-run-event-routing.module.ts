import { NonVirtualRunEventComponent } from './non-virtual-run-event.component';
import { NonVirtualRunEventPutFormComponent } from './non-virtual-run-event-form/non-virtual-run-event-put-form.component';
import { NonVirtualRunEventPostFormComponent } from './non-virtual-run-event-form/non-virtual-run-event-post-form.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: '',
            component: NonVirtualRunEventComponent,
            children: [
                {
                    path: 'create',
                    component: NonVirtualRunEventPostFormComponent
                },
                {
                    path: ':Id/edit',
                    component: NonVirtualRunEventPutFormComponent
                }
            ]
        }
    ])],
    exports: [RouterModule]
})
export class NonVirtualRunEventRoutingModule { }
