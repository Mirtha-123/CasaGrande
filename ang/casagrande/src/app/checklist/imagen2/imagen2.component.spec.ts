import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Imagen2Component } from './imagen2.component';

describe('Imagen2Component', () => {
  let component: Imagen2Component;
  let fixture: ComponentFixture<Imagen2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Imagen2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Imagen2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
