import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreventivoKitFormularioComponent } from './preventivo-kit-formulario.component';

describe('PreventivoKitFormularioComponent', () => {
  let component: PreventivoKitFormularioComponent;
  let fixture: ComponentFixture<PreventivoKitFormularioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreventivoKitFormularioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreventivoKitFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
