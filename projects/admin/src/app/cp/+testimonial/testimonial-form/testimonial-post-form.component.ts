import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { Testimonial, TestimonialService } from '../../../entities/Resource';
import { AbstractSimplePostFormComponent } from '../../simple-form/abstract-simple-post-form.component';

import { fadeInAnimation, FormService } from '../../../../../../stooges/src/public_api';

@Component({
  templateUrl: '../../simple-form/simple-form.component.html',
  styleUrls: ['../../simple-form/simple-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInAnimation]
})
export class TestimonialPostFormComponent extends AbstractSimplePostFormComponent<Testimonial> implements OnInit {

  constructor(
    cdr: ChangeDetectorRef,
    testimonialService: TestimonialService,
    edmFormService: FormService
  ) {
    super(cdr, testimonialService, edmFormService);
  }

  ngOnInit() {
    this.displayKeys = ['avatar','name','designation','description'];
    this.resourceConstructor = Testimonial;
    super.ngOnInit();
  }
}


