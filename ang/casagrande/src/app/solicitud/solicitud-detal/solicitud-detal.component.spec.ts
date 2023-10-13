import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudDetalComponent } from './solicitud-detal.component';

describe('SolicitudDetalComponent', () => {
  let component: SolicitudDetalComponent;
  let fixture: ComponentFixture<SolicitudDetalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SolicitudDetalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudDetalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
