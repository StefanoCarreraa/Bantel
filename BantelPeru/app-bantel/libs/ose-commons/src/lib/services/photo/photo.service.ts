import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Image } from '../../interfaces/photo';
import { PhotoModule } from './photo.module';
@Injectable({
  providedIn: 'root'
})
export class PhotoService {

    constructor(private http: HttpClient) { }

    getImages() {
    return this.http.get<any>('assets/data/photos/photos.json')
      .toPromise()
      .then(res => <Image[]>res.data)
      .then(data => { return data; });
    }
}

