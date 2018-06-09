import { Carousel } from './../../entities/Resource/Carousel';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { fadeInAnimation, EntityConstructor } from '../../../../../stooges/src/public_api';

 
@Component({
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInAnimation]
})
export class EventComponent implements OnInit {

  constructor() {

  }

  entity : EntityConstructor = Carousel;
  displayedColumns = ['image_pc', 'title1', 'title2', 'description', 'linkText'];
  sort = 'sort';
  desc = false;
  
  ngOnInit() {
    




  }
 
}




