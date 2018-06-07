import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { FAQ, FAQService } from '../../../entities/Resource';
import { AbstractSimplePostFormComponent } from '../../simple-form/abstract-simple-post-form.component';

import { fadeInAnimation, FormService } from '../../../../../../stooges/src/public_api';

@Component({
  templateUrl: '../../simple-form/simple-form.component.html',
  styleUrls: ['../../simple-form/simple-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInAnimation]
})
export class FAQPostFormComponent extends AbstractSimplePostFormComponent<FAQ> implements OnInit {

  constructor(
    cdr: ChangeDetectorRef,
    faqService: FAQService,
    edmFormService: FormService
  ) {
    super(cdr, faqService, edmFormService);
  }

  ngOnInit() {
    this.displayKeys = ['question', 'answer'];
    this.resourceConstructor = FAQ;
    super.ngOnInit();
  }
}


