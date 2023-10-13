import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuxiliarFormularioComponent } from './auxiliar-formulario.component';

describe('AuxiliarFormularioComponent', () => {
  let component: AuxiliarFormularioComponent;
  let fixture: ComponentFixture<AuxiliarFormularioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuxiliarFormularioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuxiliarFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
