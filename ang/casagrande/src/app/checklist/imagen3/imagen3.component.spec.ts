import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Imagen3Component } from './imagen3.component';

describe('Imagen3Component', () => {
  let component: Imagen3Component;
  let fixture: ComponentFixture<Imagen3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Imagen3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Imagen3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
