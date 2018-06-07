import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { TestimonialService, Testimonial } from '../../../entities/Resource';
import { TestimonialComponent } from '../testimonial.component';
import { AbstractSimplePutFormComponent } from '../../simple-form/abstract-simple-put-form.component';
import { FormService, fadeInAnimation } from '../../../../../../stooges/src/public_api';

@Component({
  templateUrl: '../../simple-form/simple-form.component.html',
  styleUrls: ['../../simple-form/simple-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInAnimation]
})
export class TestimonialPutFormComponent extends AbstractSimplePutFormComponent<Testimonial> implements OnInit {

  constructor(
    cdr: ChangeDetectorRef,
    testimonialService: TestimonialService,
    activatedRoute: ActivatedRoute,
    router: Router,
    edmFormService: FormService,
    testimonialComponent: TestimonialComponent
  ) {
    super(cdr, testimonialService, activatedRoute, router, edmFormService, testimonialComponent);
  }

  async ngOnInit() {
    this.displayKeys = ['avatar','name','designation','description'];    
    super.ngOnInit();
  }

}



