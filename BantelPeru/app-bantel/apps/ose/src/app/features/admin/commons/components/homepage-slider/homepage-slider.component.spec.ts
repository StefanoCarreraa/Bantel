import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomepageSliderComponent } from './homepage-slider.component';

describe('HomepageSliderComponent', () => {
  let component: HomepageSliderComponent;
  let fixture: ComponentFixture<HomepageSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomepageSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomepageSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
