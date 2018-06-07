import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { Product, ProductService } from '../../../entities/Resource';
import { AbstractSimplePostFormComponent } from '../../simple-form/abstract-simple-post-form.component';

import { fadeInAnimation, FormService } from '../../../../../../stooges/src/public_api';

@Component({
  templateUrl: '../../simple-form/simple-form.component.html',
  styleUrls: ['../../simple-form/simple-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInAnimation]
})
export class ProductPostFormComponent extends AbstractSimplePostFormComponent<Product> implements OnInit {

  constructor(
    cdr: ChangeDetectorRef,
    productService: ProductService,
    edmFormService: FormService
  ) {
    super(cdr, productService, edmFormService);
  }

  ngOnInit() {
    this.displayKeys = ['images','title','urlTitle','amount','summary','description'];
    this.resourceConstructor = Product;
    super.ngOnInit();
  }
}


