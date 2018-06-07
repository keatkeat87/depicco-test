import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NonVirtualRunEventService, NonVirtualRunEvent } from '../../../entities/Resource';
import { NonVirtualRunEventComponent } from '../non-virtual-run-event.component';
import { AbstractSimplePutFormComponent } from '../../simple-form/abstract-simple-put-form.component';
import { FormService, fadeInAnimation } from '../../../../../../stooges/src/public_api';

@Component({
  templateUrl: '../../simple-form/simple-form.component.html',
  styleUrls: ['../../simple-form/simple-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInAnimation]
})
export class NonVirtualRunEventPutFormComponent extends AbstractSimplePutFormComponent<NonVirtualRunEvent> implements OnInit {

  constructor(
    cdr: ChangeDetectorRef,
    nonVirtualRunEventService: NonVirtualRunEventService,
    activatedRoute: ActivatedRoute,
    router: Router,
    edmFormService: FormService,
    nonVirtualRunEventComponent: NonVirtualRunEventComponent
  ) {
    super(cdr, nonVirtualRunEventService, activatedRoute, router, edmFormService, nonVirtualRunEventComponent);
  }

  async ngOnInit() {
    this.displayKeys = [
      'image', 'title', 'urlTitle', 'registerDeadline', 'startRunDate', 
      'endRunDate', 'registerAmount', 'participant', 'summary', 'description',
      'googleFormLink', 'location', 'startRunTime', 'endRunTime'
    ];
    super.ngOnInit();
  }

}



