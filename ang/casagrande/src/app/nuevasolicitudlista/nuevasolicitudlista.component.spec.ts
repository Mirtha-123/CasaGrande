import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevasolicitudlistaComponent } from './nuevasolicitudlista.component';

describe('NuevasolicitudlistaComponent', () => {
  let component: NuevasolicitudlistaComponent;
  let fixture: ComponentFixture<NuevasolicitudlistaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NuevasolicitudlistaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NuevasolicitudlistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
