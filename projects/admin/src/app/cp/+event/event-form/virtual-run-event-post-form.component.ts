import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { VirtualRunEvent, VirtualRunEventService } from '../../../entities/Resource';

import { fadeInAnimation, FormService } from '../../../../../../stooges/src/public_api';
import { AbstractSimplePostFormComponent } from '../../simple-form/abstract-simple-post-form.component';

@Component({
  templateUrl: '../../simple-form/simple-form.component.html',
  styleUrls: ['../../simple-form/simple-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInAnimation]
})
export class VirtualRunEventPostFormComponent extends AbstractSimplePostFormComponent<VirtualRunEvent> implements OnInit {

  constructor(
    cdr: ChangeDetectorRef,
    virtualRunEventService: VirtualRunEventService,
    edmFormService: FormService
  ) {
    super(cdr, virtualRunEventService, edmFormService);
  }

  ngOnInit() {
    this.displayKeys = [
      'image', 'title', 'urlTitle', 'registerDeadline', 'startRunDate', 
      'endRunDate', 'registerAmount', 'participant', 'summary', 'description',
      'googleFormLink', 'group'
    ];
    this.resourceConstructor = VirtualRunEvent;
    super.ngOnInit();
  }
}


