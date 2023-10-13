import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Imagen4Component } from './imagen4.component';

describe('Imagen4Component', () => {
  let component: Imagen4Component;
  let fixture: ComponentFixture<Imagen4Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Imagen4Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Imagen4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
