import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoIngresoComponent } from './nuevo-ingreso.component';

describe('NuevoIngresoComponent', () => {
  let component: NuevoIngresoComponent;
  let fixture: ComponentFixture<NuevoIngresoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NuevoIngresoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NuevoIngresoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
