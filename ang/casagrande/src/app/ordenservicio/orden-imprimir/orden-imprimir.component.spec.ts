import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenImprimirComponent } from './orden-imprimir.component';

describe('OrdenImprimirComponent', () => {
  let component: OrdenImprimirComponent;
  let fixture: ComponentFixture<OrdenImprimirComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdenImprimirComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdenImprimirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
