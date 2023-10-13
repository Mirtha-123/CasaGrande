import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreventivoUsoKitsComponent } from './preventivo-uso-kits.component';

describe('PreventivoUsoKitsComponent', () => {
  let component: PreventivoUsoKitsComponent;
  let fixture: ComponentFixture<PreventivoUsoKitsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreventivoUsoKitsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreventivoUsoKitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
