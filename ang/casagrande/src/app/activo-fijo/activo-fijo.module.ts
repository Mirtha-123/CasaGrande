import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActivoFijoRoutingModule } from './activo-fijo-routing.module';
import { ActivoFijoComponent } from './activo-fijo.component';
import { RounavbarModule } from '../rounavbar/rounavbar.module';
import { ActivoFijoFormularioComponent } from './activo-fijo-formulario/activo-fijo-formulario.component';

@NgModule({
  declarations: [
    ActivoFijoComponent,
    ActivoFijoFormularioComponent
  ],
  imports: [
    RounavbarModule,
    CommonModule,
    ActivoFijoRoutingModule
  ],
  entryComponents: [
    ActivoFijoFormularioComponent
  ]
})
export class ActivoFijoModule { }
