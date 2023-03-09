import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LibroReclamacionesComponent } from './libro-reclamaciones.component';

describe('LibroReclamacionesComponent', () => {
  let component: LibroReclamacionesComponent;
  let fixture: ComponentFixture<LibroReclamacionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LibroReclamacionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LibroReclamacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
