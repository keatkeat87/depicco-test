import { EventComponent } from './event.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: '',
            component: EventComponent
        }
    ])],
    exports: [RouterModule]
})
export class EventRoutingModule { }
