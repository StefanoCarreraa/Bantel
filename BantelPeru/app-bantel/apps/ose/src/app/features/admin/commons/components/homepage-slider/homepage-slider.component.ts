import { Component, OnInit } from '@angular/core';
import { PhotoService } from '../../../../../../../../../libs/ose-commons/src/lib/services/photo/photo.service';

@Component({
  selector: 'app-homepage-slider',
  templateUrl: './homepage-slider.component.html',
  styleUrls: ['./homepage-slider.component.scss']
})
export class HomepageSliderComponent implements OnInit {
  images: any[];

  responsiveOptions:any[] = [
      {
          breakpoint: '1024px',
          numVisible: 5
      },
      {
          breakpoint: '768px',
          numVisible: 3
      },
      {
          breakpoint: '560px',
          numVisible: 1
      }
  ];
  constructor(private photoService: PhotoService) { }

  ngOnInit() {
    this.photoService.getImages().then(images => this.images = images)
}

}
