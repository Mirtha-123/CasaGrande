import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsFormularioComponent } from './items-formulario.component';

describe('ItemsFormularioComponent', () => {
  let component: ItemsFormularioComponent;
  let fixture: ComponentFixture<ItemsFormularioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemsFormularioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemsFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
