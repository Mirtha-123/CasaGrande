import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CerrarOrdenPreventivaComponent } from './cerrar-orden-preventiva.component';

describe('CerrarOrdenPreventivaComponent', () => {
  let component: CerrarOrdenPreventivaComponent;
  let fixture: ComponentFixture<CerrarOrdenPreventivaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CerrarOrdenPreventivaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CerrarOrdenPreventivaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
