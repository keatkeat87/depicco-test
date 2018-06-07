import { PostComponent } from './post.component';
import { PostPutFormComponent } from './post-form/post-put-form.component';
import { PostPostFormComponent } from './post-form/post-post-form.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: '',
            component: PostComponent,
            children: [
                {
                    path: 'create',
                    component: PostPostFormComponent
                },
                {
                    path: ':Id/edit',
                    component: PostPutFormComponent
                }
            ]
        }
    ])],
    exports: [RouterModule]
})
export class PostRoutingModule { }
