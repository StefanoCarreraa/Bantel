import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprobantesDocumentsComponent } from './comprobantes-documents.component';

describe('ComprobantesDocumentsComponent', () => {
  let component: ComprobantesDocumentsComponent;
  let fixture: ComponentFixture<ComprobantesDocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComprobantesDocumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComprobantesDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
