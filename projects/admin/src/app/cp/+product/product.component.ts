import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Product, ProductService } from '../../entities/Resource';

import { 
  fadeInAnimation,
  StoogesAppComponent,
  YoutubeLoadingService,
  QueryParams, 
  ResourceStream,
  MatCPTableConfig,
  MAT_CP_TABLE_CONFIG,
  TableService,
  MatAbstractCPTableComponent,
  MatConfirmDialogService,
  TableSetting
} from '../../../../../stooges/src/public_api';


type ResourceType = Product;

@Component({
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInAnimation]
})
export class ProductComponent extends MatAbstractCPTableComponent<ResourceType> implements OnInit {

  constructor(
    activatedRoute: ActivatedRoute,
    router: Router,
    cdr: ChangeDetectorRef,
    youtubeLoading: YoutubeLoadingService,
    private productService: ProductService,
    confirmService: MatConfirmDialogService,
    stoogesAppComponent: StoogesAppComponent,
    private tableService: TableService,
    @Inject(MAT_CP_TABLE_CONFIG) tableConfig: MatCPTableConfig 
  ) {
    super(activatedRoute, router, cdr, youtubeLoading, productService, confirmService, stoogesAppComponent, tableConfig);
  }

  protected getResourcesStream(queryParams: QueryParams): ResourceStream<ResourceType[]> {
    return this.productService.queryWatch(queryParams);
  }

  async ngOnInit() {

    let resource = new Product();
    this.keyAndTControls = this.tableService.generateTControls(resource);
    this.displayedColumns = ['images','title','amount'];  
    this.setting = new TableSetting({
      rowPerPage: 10,
      sort: 'sort',
      desc: false,
      search: {
        string: ['title','urlTitle','summary','description'],
        number: ['amount'],
        date: []
      }
    });

    this.startup();
  }


}



