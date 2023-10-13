import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenservicioComponent } from './ordenservicio.component';

describe('OrdenservicioComponent', () => {
  let component: OrdenservicioComponent;
  let fixture: ComponentFixture<OrdenservicioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdenservicioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdenservicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
