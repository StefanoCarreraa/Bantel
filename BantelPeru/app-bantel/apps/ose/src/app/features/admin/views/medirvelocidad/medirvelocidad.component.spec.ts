import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedirvelocidadComponent } from './medirvelocidad.component';

describe('MedirvelocidadComponent', () => {
  let component: MedirvelocidadComponent;
  let fixture: ComponentFixture<MedirvelocidadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedirvelocidadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedirvelocidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
