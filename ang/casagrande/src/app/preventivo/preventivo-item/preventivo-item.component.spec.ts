import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreventivoItemComponent } from './preventivo-item.component';

describe('PreventivoItemComponent', () => {
  let component: PreventivoItemComponent;
  let fixture: ComponentFixture<PreventivoItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreventivoItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreventivoItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
