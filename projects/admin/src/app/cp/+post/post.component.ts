import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Post, PostService } from '../../entities/Resource';

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
    private postService: PostService,
    confirmService: MatConfirmDialogService,
    stoogesAppComponent: StoogesAppComponent,
    tableService: TableService,
    @Inject(MAT_CP_TABLE_CONFIG) tableConfig: MatCPTableConfig 
  ) {
    super(activatedRoute, router, cdr, youtubeLoading, postService, confirmService, stoogesAppComponent, tableConfig, tableService);
  }

  protected getResourcesStream(queryParams: QueryParams): ResourceStream<ResourceType[]> {
    if (this.sort == 'publishedDate') {
      const desc = ((this.desc) ? ' desc' : '');
      queryParams['$orderby'] = `publishedDate${desc},Id${desc}`;
    } 
    return this.postService.queryWatch(queryParams);
  } 
  async ngOnInit() { 

    let resource = new Post();
    this.keyAndTControls = this.tableService.generateTControls(resource);
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



