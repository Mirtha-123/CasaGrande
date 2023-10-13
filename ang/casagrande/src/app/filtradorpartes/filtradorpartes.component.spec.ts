import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltradorpartesComponent } from './filtradorpartes.component';

describe('FiltradorpartesComponent', () => {
  let component: FiltradorpartesComponent;
  let fixture: ComponentFixture<FiltradorpartesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltradorpartesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltradorpartesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
