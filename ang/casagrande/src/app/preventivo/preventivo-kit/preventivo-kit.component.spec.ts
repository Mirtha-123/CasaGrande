import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreventivoKitComponent } from './preventivo-kit.component';

describe('PreventivoKitComponent', () => {
  let component: PreventivoKitComponent;
  let fixture: ComponentFixture<PreventivoKitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreventivoKitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreventivoKitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
