import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CarouselService, Carousel } from '../../../entities/Resource';
import { CarouselComponent } from '../carousel.component';
import { AbstractSimplePutFormComponent } from '../../simple-form/abstract-simple-put-form.component';
import { FormService, fadeInAnimation } from '../../../../../../stooges/src/public_api';

@Component({
  templateUrl: '../../simple-form/simple-form.component.html',
  styleUrls: ['../../simple-form/simple-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInAnimation]
})
export class CarouselPutFormComponent extends AbstractSimplePutFormComponent<Carousel> implements OnInit {

  constructor(
    cdr: ChangeDetectorRef,
    carouselService: CarouselService,
    activatedRoute: ActivatedRoute,
    router: Router,
    edmFormService: FormService,
    carouselComponent: CarouselComponent
  ) {
    super(cdr, carouselService, activatedRoute, router, edmFormService, carouselComponent);
  }

  async ngOnInit() {
    this.displayKeys = [
      'image_mobile', 'image_pc', 'title1', 'title2', 'description', 'linkText', 'link'
    ];
    super.ngOnInit();
  }

}



