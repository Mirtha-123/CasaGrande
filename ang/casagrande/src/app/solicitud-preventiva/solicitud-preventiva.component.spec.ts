import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudPreventivaComponent } from './solicitud-preventiva.component';

describe('SolicitudPreventivaComponent', () => {
  let component: SolicitudPreventivaComponent;
  let fixture: ComponentFixture<SolicitudPreventivaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SolicitudPreventivaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudPreventivaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
