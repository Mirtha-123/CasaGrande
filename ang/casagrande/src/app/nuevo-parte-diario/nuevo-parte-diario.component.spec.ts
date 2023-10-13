import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoParteDiarioComponent } from './nuevo-parte-diario.component';

describe('NuevoParteDiarioComponent', () => {
  let component: NuevoParteDiarioComponent;
  let fixture: ComponentFixture<NuevoParteDiarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NuevoParteDiarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NuevoParteDiarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
