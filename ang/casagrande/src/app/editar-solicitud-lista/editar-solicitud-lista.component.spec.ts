import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarSolicitudListaComponent } from './editar-solicitud-lista.component';

describe('EditarSolicitudListaComponent', () => {
  let component: EditarSolicitudListaComponent;
  let fixture: ComponentFixture<EditarSolicitudListaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditarSolicitudListaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarSolicitudListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
