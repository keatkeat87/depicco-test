import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { FAQ, FAQService } from '../../entities/Resource';

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


type ResourceType = FAQ;

@Component({
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInAnimation]
})
export class FAQComponent extends MatAbstractCPTableComponent<ResourceType> implements OnInit {

  constructor(
    activatedRoute: ActivatedRoute,
    router: Router,
    cdr: ChangeDetectorRef,
    youtubeLoading: YoutubeLoadingService,
    private faqService: FAQService,
    confirmService: MatConfirmDialogService,
    stoogesAppComponent: StoogesAppComponent,
    private tableService: TableService,
    @Inject(MAT_CP_TABLE_CONFIG) tableConfig: MatCPTableConfig
  ) {
    super(activatedRoute, router, cdr, youtubeLoading, faqService, confirmService, stoogesAppComponent, tableConfig);
  }

  protected getResourcesStream(queryParams: QueryParams): ResourceStream<ResourceType[]> {
    return this.faqService.queryWatch(queryParams);
  }
  async ngOnInit() {

    let resource = new FAQ();
    this.keyAndTControls = this.tableService.generateTControls(resource);
    this.displayedColumns = ['question', 'answer'];

    this.setting = new TableSetting({
      rowPerPage: 10,
      sort: 'sort',
      desc: false,
      search: {
        string: ['question', 'answer'],
        number: ['Id'],
        date: []
      }
    });

    this.startup();
  }


}



