import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartesdiariosComponent } from './partesdiarios.component';

describe('PartesdiariosComponent', () => {
  let component: PartesdiariosComponent;
  let fixture: ComponentFixture<PartesdiariosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartesdiariosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartesdiariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
