import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Event, EventService } from '../../entities/Resource';

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


type ResourceType = Event;

@Component({
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInAnimation]
})
export class EventComponent extends MatAbstractCPTableComponent<ResourceType> implements OnInit {

  constructor(
    activatedRoute: ActivatedRoute,
    router: Router,
    cdr: ChangeDetectorRef,
    youtubeLoading: YoutubeLoadingService,
    private eventService: EventService,
    confirmService: MatConfirmDialogService,
    stoogesAppComponent: StoogesAppComponent,
    private tableService: TableService,
    @Inject(MAT_CP_TABLE_CONFIG) tableConfig: MatCPTableConfig
  ) {
    super(activatedRoute, router, cdr, youtubeLoading, eventService, confirmService, stoogesAppComponent, tableConfig);
  }

  protected getResourcesStream(queryParams: QueryParams): ResourceStream<ResourceType[]> {
    return this.eventService.queryWatch(queryParams);
  }

  async ngOnInit() {

    let resource = new Event();
    this.keyAndTControls = this.tableService.generateTControls(resource);
    this.displayedColumns = ['Id', 'image', 'title', 'registerDeadline', 'startRunDate', 'endRunDate', 'registerAmount', 'participant'];
    this.setting = new TableSetting({
      rowPerPage: 10,
      sort: 'sort',
      desc: true,
      search: {
        string: ['title'],
        number: ['registerAmount', 'participant'],
        date: ['registerDeadline', 'startRunDate', 'endRunDate']
      }
    });

    this.startup();
  }


}



