import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Carousel, CarouselService } from '../../entities/Resource';

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


type ResourceType = Carousel;

@Component({
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInAnimation]
})
export class CarouselComponent extends MatAbstractCPTableComponent<ResourceType> implements OnInit {

  constructor(
    activatedRoute: ActivatedRoute,
    router: Router,
    cdr: ChangeDetectorRef,
    youtubeLoading: YoutubeLoadingService,
    private carouselService: CarouselService,
    confirmService: MatConfirmDialogService,
    stoogesAppComponent: StoogesAppComponent,
    tableService: TableService,
    @Inject(MAT_CP_TABLE_CONFIG) tableConfig: MatCPTableConfig
  ) {
    super(activatedRoute, router, cdr, youtubeLoading, carouselService, confirmService, stoogesAppComponent, tableConfig, tableService);
  }

  protected getResourcesStream(queryParams: QueryParams): ResourceStream<ResourceType[]> {
    return this.carouselService.queryWatch(queryParams);
  }

  async ngOnInit() {

    let resource = new Carousel();
    this.keyAndTControls = this.tableService.generateTControls(resource);
    this.displayedColumns = ['image_pc', 'title1', 'title2', 'description', 'linkText'];

    this.setting = new TableSetting({
      rowPerPage: 10,
      sort: 'sort',
      desc: false,
      search: {
        string: ['title1', 'title2', 'description', 'linkText', 'link'],
        number: [],
        date: []
      }
    });

    this.startup();
  }


}



