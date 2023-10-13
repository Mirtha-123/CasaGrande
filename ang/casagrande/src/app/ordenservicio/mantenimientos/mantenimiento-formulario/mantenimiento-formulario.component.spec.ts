import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoFormularioComponent } from './mantenimiento-formulario.component';

describe('MantenimientoFormularioComponent', () => {
  let component: MantenimientoFormularioComponent;
  let fixture: ComponentFixture<MantenimientoFormularioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MantenimientoFormularioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MantenimientoFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
