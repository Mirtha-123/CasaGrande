import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImprimirTareaComponent } from './imprimir-tarea.component';

describe('ImprimirTareaComponent', () => {
  let component: ImprimirTareaComponent;
  let fixture: ComponentFixture<ImprimirTareaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImprimirTareaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImprimirTareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
