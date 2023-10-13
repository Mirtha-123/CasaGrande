import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CerrarodComponent } from './cerrarod.component';

describe('CerrarodComponent', () => {
  let component: CerrarodComponent;
  let fixture: ComponentFixture<CerrarodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CerrarodComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CerrarodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
