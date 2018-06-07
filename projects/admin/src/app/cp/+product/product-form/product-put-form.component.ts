import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ProductService, Product } from '../../../entities/Resource';
import { ProductComponent } from '../product.component';
import { AbstractSimplePutFormComponent } from '../../simple-form/abstract-simple-put-form.component';
import { FormService, fadeInAnimation } from '../../../../../../stooges/src/public_api';

@Component({
  templateUrl: '../../simple-form/simple-form.component.html',
  styleUrls: ['../../simple-form/simple-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInAnimation]
})
export class ProductPutFormComponent extends AbstractSimplePutFormComponent<Product> implements OnInit {

  constructor(
    cdr: ChangeDetectorRef,
    productService: ProductService,
    activatedRoute: ActivatedRoute,
    router: Router,
    edmFormService: FormService,
    productComponent: ProductComponent
  ) {
    super(cdr, productService, activatedRoute, router, edmFormService, productComponent);
  }

  async ngOnInit() {
    this.displayKeys = ['images','title','urlTitle','amount','summary','description'];
    super.ngOnInit();
  }

}



