import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportePreventivoComponent } from './reporte-preventivo.component';

describe('ReportePreventivoComponent', () => {
  let component: ReportePreventivoComponent;
  let fixture: ComponentFixture<ReportePreventivoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportePreventivoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportePreventivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
