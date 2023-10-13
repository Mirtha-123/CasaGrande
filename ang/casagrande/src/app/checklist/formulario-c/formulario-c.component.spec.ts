import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioCComponent } from './formulario-c.component';

describe('FormularioCComponent', () => {
  let component: FormularioCComponent;
  let fixture: ComponentFixture<FormularioCComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormularioCComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormularioCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
