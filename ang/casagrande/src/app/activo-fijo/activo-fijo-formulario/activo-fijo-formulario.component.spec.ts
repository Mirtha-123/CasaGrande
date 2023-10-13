import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivoFijoFormularioComponent } from './activo-fijo-formulario.component';

describe('ActivoFijoFormularioComponent', () => {
  let component: ActivoFijoFormularioComponent;
  let fixture: ComponentFixture<ActivoFijoFormularioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivoFijoFormularioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivoFijoFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
