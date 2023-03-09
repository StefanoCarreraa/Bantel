import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomepagePlansComponent } from './homepage-plans.component';

describe('HomepagePlansComponent', () => {
  let component: HomepagePlansComponent;
  let fixture: ComponentFixture<HomepagePlansComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomepagePlansComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomepagePlansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
