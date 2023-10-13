import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoReporteComponent } from './mantenimiento-reporte.component';

describe('MantenimientoReporteComponent', () => {
  let component: MantenimientoReporteComponent;
  let fixture: ComponentFixture<MantenimientoReporteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MantenimientoReporteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MantenimientoReporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
