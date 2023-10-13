import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreventivoTareaComponent } from './preventivo-tarea.component';

describe('PreventivoTareaComponent', () => {
  let component: PreventivoTareaComponent;
  let fixture: ComponentFixture<PreventivoTareaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreventivoTareaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreventivoTareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
