import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { Post, PostService } from '../../../entities/Resource';
import { AbstractSimplePostFormComponent } from '../../simple-form/abstract-simple-post-form.component';

import { fadeInAnimation, FormService } from '../../../../../../stooges/src/public_api';

@Component({
  templateUrl: '../../simple-form/simple-form.component.html',
  styleUrls: ['../../simple-form/simple-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInAnimation]
})
export class PostPostFormComponent extends AbstractSimplePostFormComponent<Post> implements OnInit {

  constructor(
    cdr: ChangeDetectorRef,
    postService: PostService,
    edmFormService: FormService
  ) {
    super(cdr, postService, edmFormService);
  }

  ngOnInit() {
    this.displayKeys = ['image','title','urlTitle','publishedDate','author','summary','description'];
    this.resourceConstructor = Post;
    super.ngOnInit();
  }
}


