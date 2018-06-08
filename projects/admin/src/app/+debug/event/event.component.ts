import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, Inject, Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Event, EventService, NonVirtualRunEvent, VirtualRunEvent } from '../../entities/Resource';

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
  TableSetting,
  odataType,
} from '../../../../../stooges/src/public_api';

import * as entities from '../../entities/Resource';
 
type ResourceType = Event | NonVirtualRunEvent | VirtualRunEvent;

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
    eventService: EventService,
    confirmService: MatConfirmDialogService,
    stoogesAppComponent: StoogesAppComponent,
    tableService: TableService,
    @Inject(MAT_CP_TABLE_CONFIG) tableConfig: MatCPTableConfig,
    injector: Injector
  ) {
    super(activatedRoute, router, cdr, youtubeLoading, eventService, confirmService, stoogesAppComponent, tableConfig, tableService, injector);
  }

  protected getResourcesStream(queryParams: QueryParams): ResourceStream<ResourceType[]> {
    let resourceService = this.getNiceParentEntityItemBySelectedEntityItems().service;
    return resourceService.queryWatch(queryParams);
  }

  async ngOnInit() {

    this.rootEntity = Event;
    this.projectEntities = Object.keys(entities).map(key => entities[key]);

    this.displayedColumns = [
      odataType, 'image', 'title', 'registerDeadline', 'startRunDate', 'endRunDate', 'registerAmount', 'participant', 
      'NonVirtualRunEvent.location',
      'VirtualRunEvent.group'
    ];
    this.setting = new TableSetting({
      rowPerPage: 10,
      sort: 'sort',
      desc: true,
      search: {
        string: ['title', 'VirtualRunEvent.group', 'NonVirtualRunEvent.location'],
        number: ['registerAmount', 'participant'],
        date: ['registerDeadline', 'startRunDate', 'endRunDate']
      }
    });

    // let resource = new Event();
    // this.keyAndTControls = this.tableService.generateTControls(resource);
 

    this.startup();
  }


}




