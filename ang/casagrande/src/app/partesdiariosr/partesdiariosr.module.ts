import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RounavbarModule } from '../rounavbar/rounavbar.module'
import { PartesdiariosrRoutingModule } from './partesdiariosr-routing.module';
import { PartesdiariosComponent } from '../partesdiarios/partesdiarios.component';
import { FiltradorpartesComponent } from '../filtradorpartes/filtradorpartes.component';
import { NuevoIngresoComponent } from '../partesdiarios/nuevo-ingreso/nuevo-ingreso.component';
import { NuevoParteDiarioComponent } from '../nuevo-parte-diario/nuevo-parte-diario.component';

@NgModule({
  declarations: [
    PartesdiariosComponent,
    FiltradorpartesComponent,
    NuevoParteDiarioComponent,
    NuevoIngresoComponent
  ],
  imports: [
    CommonModule,
    RounavbarModule,
    PartesdiariosrRoutingModule
  ],
  entryComponents: [
    NuevoIngresoComponent
    ]
})
export class PartesdiariosrModule { }
