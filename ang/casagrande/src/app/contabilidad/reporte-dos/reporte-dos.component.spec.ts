import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteDosComponent } from './reporte-dos.component';

describe('ReporteDosComponent', () => {
  let component: ReporteDosComponent;
  let fixture: ComponentFixture<ReporteDosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReporteDosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteDosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
