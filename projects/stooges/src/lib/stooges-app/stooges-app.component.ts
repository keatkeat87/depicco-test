import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
} from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { popupAnimation } from '../animations/popup.animation';
import { YoutubeLoadingService } from '../common/services/youtube-loading.service';
import { AlertService } from '../common/services/alert.service';
import { TitleMetaDescriptionService } from '../common/services/title-meta-description.service';
import { filter, skip, take } from 'rxjs/operators';

@Component({
  selector: 'stooges-app',
  templateUrl: './stooges-app.component.html',
  styleUrls: ['./stooges-app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [popupAnimation]
})
export class StoogesAppComponent implements OnInit {

  isShowYoutubeLoading = false;
  public refreshEmitter = new EventEmitter();
  // 检查用户是否移动过, 如果是 replace url 拿无法检查的出来哦, ng 无法识别呢.
  // 这个可以方便用来做 historyback or ../
  public hasLocationHistory = false; 

  constructor(
    private router: Router,
    private alertService: AlertService,
    private cdr: ChangeDetectorRef,
    private titleMetaService: TitleMetaDescriptionService,
    private youtubeLoadingService: YoutubeLoadingService
  ) { }

  showAlertError = false;
  alertMessage = '';
     
  closeAlert() {
    this.showAlertError = false;
    this.alertService.onAlertClose$.next();
  }

  ngOnInit() {

    // title & meta
    this.titleMetaService.setup();

    // youtube loading when router change 
    this.router.events.pipe(filter(e => e instanceof NavigationStart || e instanceof NavigationEnd || e instanceof NavigationCancel)).subscribe(e => {
      if (e instanceof NavigationStart) {
        this.youtubeLoadingService.start();
      }
      if (e instanceof NavigationEnd || e instanceof NavigationCancel) {
        this.youtubeLoadingService.end();
      }
    });

    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      skip(1),
      take(1)
    ).subscribe(_ => {
      this.hasLocationHistory = true;
    });

    // display when alert 
    this.alertService.onAlert$.subscribe(message => {
      this.showAlertError = true;
      this.alertMessage = message;
      this.cdr.markForCheck();
    });
  }
}
