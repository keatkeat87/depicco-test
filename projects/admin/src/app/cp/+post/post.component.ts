import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, Inject, Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Post } from '../../entities/Resource';

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


type ResourceType = Post;
 
@Component({
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInAnimation]
})
export class PostComponent extends MatAbstractCPTableComponent<ResourceType> implements OnInit {

  constructor(
    activatedRoute: ActivatedRoute,
    router: Router,
    cdr: ChangeDetectorRef,
    youtubeLoading: YoutubeLoadingService,
    stoogesAppComponent: StoogesAppComponent,
    tableService: TableService,
    @Inject(MAT_CP_TABLE_CONFIG) tableConfig: MatCPTableConfig,
    injector: Injector,
    confirmService: MatConfirmDialogService,
  ) {
    super(activatedRoute, router, cdr, youtubeLoading, stoogesAppComponent, tableConfig, tableService, injector, confirmService);
  }

  protected getResourcesStream(queryParams: QueryParams): ResourceStream<ResourceType[]> {
    if (this.sort == 'publishedDate') {
      const desc = ((this.desc) ? ' desc' : '');
      queryParams['$orderby'] = `publishedDate${desc},Id${desc}`;
    } 
    return this.mainResourceService.queryWatch(queryParams);
  } 
  async ngOnInit() { 

    this.mainEntity = Post;
    this.displayedColumns = ['image','title','publishedDate','author'];

    this.setting = new TableSetting({
      rowPerPage: 10,
      sort: 'publishedDate',
      desc: true,
      search: {
        string: ['title','author','urlTitle','summary','description'],
        number: [],
        date: ['publishedDate']
      }
    });

    this.startup();
  }


}



