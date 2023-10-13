import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteTransferenciaComponent } from './reporte-transferencia.component';

describe('ReporteTransferenciaComponent', () => {
  let component: ReporteTransferenciaComponent;
  let fixture: ComponentFixture<ReporteTransferenciaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReporteTransferenciaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteTransferenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
