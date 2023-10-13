import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteUnoComponent } from './reporte-uno.component';

describe('ReporteUnoComponent', () => {
  let component: ReporteUnoComponent;
  let fixture: ComponentFixture<ReporteUnoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReporteUnoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteUnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
