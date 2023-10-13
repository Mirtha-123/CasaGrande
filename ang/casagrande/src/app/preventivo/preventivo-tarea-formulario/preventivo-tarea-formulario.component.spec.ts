import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreventivoTareaFormularioComponent } from './preventivo-tarea-formulario.component';

describe('PreventivoTareaFormularioComponent', () => {
  let component: PreventivoTareaFormularioComponent;
  let fixture: ComponentFixture<PreventivoTareaFormularioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreventivoTareaFormularioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreventivoTareaFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
