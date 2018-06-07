
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, Inject, Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Event, EventService, NonVirtualRunEvent, NonVirtualRunEventService, VirtualRunEvent, VirtualRunEventService } from '../../entities/Resource';

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
  Constructor,
  METADATA_KEY,
  AbstractResourceService,
  Entity,
  MatSimpleSelectComponentGetValueOrDisplayFn,
  CompareWith
} from '../../../../../stooges/src/public_api';

import * as entities from '../../entities/Resource';
import { FormControl } from '@angular/forms';
console.log(entities);
console.log(METADATA_KEY);

type EntityItem<T extends Entity> = {
  class: Constructor,
  service: AbstractResourceService<T>
  displayName: string | null
  isAbstract: boolean,
  isRoot : boolean,
  layer : number, // 0 开始 
  parent : null | EntityItem<T>
}

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
    private eventService: EventService,
    confirmService: MatConfirmDialogService,
    stoogesAppComponent: StoogesAppComponent,
    private tableService: TableService,
    @Inject(MAT_CP_TABLE_CONFIG) tableConfig: MatCPTableConfig,
    private injector: Injector
  ) {
    super(activatedRoute, router, cdr, youtubeLoading, eventService, confirmService, stoogesAppComponent, tableConfig);
  }

  protected getResourcesStream(queryParams: QueryParams): ResourceStream<ResourceType[]> {
    
    let resourceService = this.getCorrectResourceServiceBySelectedEntityItems(); 
    return resourceService.queryWatch(queryParams);
  }



  rootEntity : Constructor
  fullEntityItems: EntityItem<ResourceType>[]
  withoutAbstractEntityItems: EntityItem<ResourceType>[]
  selectedEntityItems = new FormControl([]);
  isSelectedAllEntityItems(){
    let selectedEntityItems = this.selectedEntityItems.value as EntityItem<ResourceType>[];
    return selectedEntityItems.length == 0 || selectedEntityItems.length == this.fullEntityItems.length;
  }
  entityItemSelectGetValue: MatSimpleSelectComponentGetValueOrDisplayFn<EntityItem<ResourceType>> = (item) => {
    return item;
  }
  entityItemSelectGetDisplay: MatSimpleSelectComponentGetValueOrDisplayFn<EntityItem<ResourceType>> = (item) => {
    return item.displayName;
  }
  entityItemSelectCompareWith: CompareWith<EntityItem<ResourceType>> = (a, b) => {
    return a.class === b.class;
  }
  getCorrectResourceServiceBySelectedEntityItems(): AbstractResourceService<ResourceType> {
    if (this.isSelectedAllEntityItems()) {
      return this.fullEntityItems.find(f => f.class == this.rootEntity)!.service;
    }
    else {
      let selectedEntityItems : EntityItem<ResourceType>[] = this.selectedEntityItems.value;
      // step : 
      // 先把所有人提升至最高 layer 
      // 然后 distinct 
      // 如果不是剩下最后一个, 那么全部 up layer, 再 distinct, 一直到剩下最后一个. 
      let highestLayer = selectedEntityItems.max(s => s.layer);
      selectedEntityItems = selectedEntityItems.map(s => {
        if (s.layer > highestLayer) {
          let needUpLayer = s.layer - highestLayer;
          let tempEntityItem = s;
          for (let i = 0; i < needUpLayer; i++) {
            tempEntityItem = s.parent!;
          }
          return tempEntityItem;
        }
        else {
          return s;
        }
      }).distinct();
      while (selectedEntityItems.length != 1) {
        selectedEntityItems = selectedEntityItems.map(s => {
          return s.parent!;
        }).distinct();
      }
      return selectedEntityItems[0].service;
    }
  }

  async ngOnInit() {
    this.rootEntity = Event;
    let first: EntityItem<ResourceType> = { 
      class: Event, service: this.injector.get(EventService), 
      displayName: null, isAbstract: true, isRoot: true, layer: 0, parent: null
    };

    let second: EntityItem<ResourceType> = {
      class: NonVirtualRunEvent, service: this.injector.get(NonVirtualRunEventService),
      displayName: 'Non Virtual Run', isAbstract: false, isRoot: false, layer: 1, parent: first
    }

    let third: EntityItem<ResourceType> = {
      class: VirtualRunEvent, service: this.injector.get(VirtualRunEventService),
      displayName: 'Virtual Run', isAbstract: false, isRoot: false, layer: 1, parent: first
    }

    this.fullEntityItems = [
      first, second, third
    ]

    this.withoutAbstractEntityItems = this.fullEntityItems.filter(f => !f.isAbstract);

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




