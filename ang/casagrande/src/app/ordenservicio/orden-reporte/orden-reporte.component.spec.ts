import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenReporteComponent } from './orden-reporte.component';

describe('OrdenReporteComponent', () => {
  let component: OrdenReporteComponent;
  let fixture: ComponentFixture<OrdenReporteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdenReporteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdenReporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
