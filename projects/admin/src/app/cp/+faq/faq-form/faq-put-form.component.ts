import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { FAQService, FAQ } from '../../../entities/Resource';
import { FAQComponent } from '../faq.component';
import { AbstractSimplePutFormComponent } from '../../simple-form/abstract-simple-put-form.component';
import { FormService, fadeInAnimation } from '../../../../../../stooges/src/public_api';

@Component({
  templateUrl: '../../simple-form/simple-form.component.html',
  styleUrls: ['../../simple-form/simple-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInAnimation]
})
export class FAQPutFormComponent extends AbstractSimplePutFormComponent<FAQ> implements OnInit {

  constructor(
    cdr: ChangeDetectorRef,
    faqService: FAQService,
    activatedRoute: ActivatedRoute,
    router: Router,
    edmFormService: FormService,
    faqComponent: FAQComponent
  ) {
    super(cdr, faqService, activatedRoute, router, edmFormService, faqComponent);
  }

  async ngOnInit() {
    this.displayKeys = ['question', 'answer'];
    super.ngOnInit();
  }

}



