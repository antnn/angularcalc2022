import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeastSquaresFormComponent } from './least-squares-form.component';

describe('LeastSquaresFormComponent', () => {
  let component: LeastSquaresFormComponent;
  let fixture: ComponentFixture<LeastSquaresFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeastSquaresFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeastSquaresFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
