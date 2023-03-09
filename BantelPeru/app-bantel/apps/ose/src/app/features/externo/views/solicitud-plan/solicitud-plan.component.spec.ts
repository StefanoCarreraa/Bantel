import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudPlanComponent } from './solicitud-plan.component';

describe('SolicitudPlanComponent', () => {
  let component: SolicitudPlanComponent;
  let fixture: ComponentFixture<SolicitudPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SolicitudPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
