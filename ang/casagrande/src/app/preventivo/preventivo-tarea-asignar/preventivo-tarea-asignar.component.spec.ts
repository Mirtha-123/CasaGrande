import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreventivoTareaAsignarComponent } from './preventivo-tarea-asignar.component';

describe('PreventivoTareaAsignarComponent', () => {
  let component: PreventivoTareaAsignarComponent;
  let fixture: ComponentFixture<PreventivoTareaAsignarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreventivoTareaAsignarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreventivoTareaAsignarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
