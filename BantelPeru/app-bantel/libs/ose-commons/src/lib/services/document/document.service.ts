import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PendingDocument, PaidDocument } from '../../interfaces/document';
import { DocumentModule } from './document.module';
@Injectable({
  providedIn: 'root'
})
export class DocumentService {

    constructor(private http: HttpClient) { }

    getPendingDocuments() {
        return this.http.get<any>('assets/data/documents/pending-documents.json')
            .toPromise()
            .then(res => <PendingDocument[]>res.data)
            .then(data => { return data; });
    }

    getPaidDocuments() {
        return this.http.get<any>('assets/data/documents/paid-documents.json')
            .toPromise()
            .then(res => <PaidDocument[]>res.data)
            .then(data => { return data; });
    }
}

