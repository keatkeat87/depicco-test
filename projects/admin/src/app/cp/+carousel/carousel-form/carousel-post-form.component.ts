import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { Carousel, CarouselService } from '../../../entities/Resource';
import { AbstractSimplePostFormComponent } from '../../simple-form/abstract-simple-post-form.component';

import { fadeInAnimation, FormService } from '../../../../../../stooges/src/public_api';

@Component({
  templateUrl: '../../simple-form/simple-form.component.html',
  styleUrls: ['../../simple-form/simple-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInAnimation]
})
export class CarouselPostFormComponent extends AbstractSimplePostFormComponent<Carousel> implements OnInit {

  constructor(
    cdr: ChangeDetectorRef,
    carouselService: CarouselService,
    edmFormService: FormService
  ) {
    super(cdr, carouselService, edmFormService);
  }

  ngOnInit() {
    this.displayKeys = [
      'image_mobile', 'image_pc', 'title1', 'title2', 'description', 'linkText', 'link'
    ];
    this.resourceConstructor = Carousel;
    super.ngOnInit();
  }
}


