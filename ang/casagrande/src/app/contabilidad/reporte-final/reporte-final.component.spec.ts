import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteFinalComponent } from './reporte-final.component';

describe('ReporteFinalComponent', () => {
  let component: ReporteFinalComponent;
  let fixture: ComponentFixture<ReporteFinalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReporteFinalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteFinalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
