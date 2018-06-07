import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PostService, Post } from '../../../entities/Resource';
import { PostComponent } from '../post.component';
import { AbstractSimplePutFormComponent } from '../../simple-form/abstract-simple-put-form.component';
import { FormService, fadeInAnimation } from '../../../../../../stooges/src/public_api';

@Component({
  templateUrl: '../../simple-form/simple-form.component.html',
  styleUrls: ['../../simple-form/simple-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInAnimation]
})
export class PostPutFormComponent extends AbstractSimplePutFormComponent<Post> implements OnInit {

  constructor(
    cdr: ChangeDetectorRef,
    postService: PostService,
    activatedRoute: ActivatedRoute,
    router: Router,
    edmFormService: FormService,
    postComponent: PostComponent
  ) {
    super(cdr, postService, activatedRoute, router, edmFormService, postComponent);
  }

  async ngOnInit() {
    this.displayKeys = ['image','title','urlTitle','publishedDate','author','summary','description'];
    super.ngOnInit();
  }

}



