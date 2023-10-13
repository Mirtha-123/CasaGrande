import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevasolicitudComponent } from './nuevasolicitud.component';

describe('NuevasolicitudComponent', () => {
  let component: NuevasolicitudComponent;
  let fixture: ComponentFixture<NuevasolicitudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NuevasolicitudComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NuevasolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
