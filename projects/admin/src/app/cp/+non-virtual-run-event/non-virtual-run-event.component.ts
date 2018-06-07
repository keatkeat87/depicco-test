import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NonVirtualRunEvent, NonVirtualRunEventService } from '../../entities/Resource';

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


type ResourceType = NonVirtualRunEvent;

@Component({
  templateUrl: './non-virtual-run-event.component.html',
  styleUrls: ['./non-virtual-run-event.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInAnimation]
})
export class NonVirtualRunEventComponent extends MatAbstractCPTableComponent<ResourceType> implements OnInit {

  constructor(
    activatedRoute: ActivatedRoute,
    router: Router,
    cdr: ChangeDetectorRef,
    youtubeLoading: YoutubeLoadingService,
    private nonVirtualRunEventService: NonVirtualRunEventService,
    confirmService: MatConfirmDialogService,
    stoogesAppComponent: StoogesAppComponent,
    private tableService: TableService,
    @Inject(MAT_CP_TABLE_CONFIG) tableConfig: MatCPTableConfig
  ) {
    super(activatedRoute, router, cdr, youtubeLoading, nonVirtualRunEventService, confirmService, stoogesAppComponent, tableConfig);
  }

  protected getResourcesStream(queryParams: QueryParams): ResourceStream<ResourceType[]> {
    return this.nonVirtualRunEventService.queryWatch(queryParams);
  }

  async ngOnInit() {

    let resource = new NonVirtualRunEvent();
    this.keyAndTControls = this.tableService.generateTControls(resource);
    this.displayedColumns = ['Id', 'image', 'title', 'registerDeadline', 'startRunDate', 
    'endRunDate', 'registerAmount', 'participant', 'location', 'startRunTime', 'endRunTime'];

    this.setting = new TableSetting({
      rowPerPage: 10,
      sort: 'sort',
      desc: true,
      search: {
        string: ['title', 'location'],
        number: ['registerAmount', 'participant'],
        date: ['registerDeadline', 'startRunDate', 'endRunDate']
      }
    });

    this.startup();
  }


}



