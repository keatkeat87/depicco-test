import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, Inject, Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NonVirtualRunEvent } from '../../entities/Resource';

import {
  fadeInAnimation,
  StoogesAppComponent,
  YoutubeLoadingService,
  CPTableConfig,
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
    stoogesAppComponent: StoogesAppComponent,
    tableService: TableService,
    @Inject(MAT_CP_TABLE_CONFIG) tableConfig: CPTableConfig,
    injector: Injector,
    confirmService: MatConfirmDialogService,
  ) {
    super(activatedRoute, router, cdr, youtubeLoading, stoogesAppComponent, tableConfig, tableService, injector, confirmService);
  }

  
  async ngOnInit() {

    this.mainEntity = NonVirtualRunEvent;
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



