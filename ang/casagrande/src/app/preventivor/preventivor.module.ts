import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RounavbarModule } from '../rounavbar/rounavbar.module';
import { PreventivorRoutingModule } from './preventivor-routing.module';
import { PreventivoComponent } from '../preventivo/preventivo.component';
import { CerrarOrdenPreventivaComponent } from '../cerrar-orden-preventiva/cerrar-orden-preventiva.component';
import { SolicitudPreventivaComponent } from '../solicitud-preventiva/solicitud-preventiva.component';
import { PreventivoItemComponent } from '../preventivo/preventivo-item/preventivo-item.component';
import { PreventivoKitComponent } from '../preventivo/preventivo-kit/preventivo-kit.component';
import { PreventivoUsoKitsComponent } from '../preventivo/preventivo-uso-kits/preventivo-uso-kits.component';
import { PreventivoKitFormularioComponent } from '../preventivo/preventivo-kit/preventivo-kit-formulario/preventivo-kit-formulario.component';
import { ReportePreventivoComponent } from '../preventivo/reporte-preventivo/reporte-preventivo.component';
import { PreventivoTareaComponent } from '../preventivo/preventivo-tarea/preventivo-tarea.component';
import { PreventivoTareaFormularioComponent } from '../preventivo/preventivo-tarea-formulario/preventivo-tarea-formulario.component';
import { PreventivoTareaAsignarComponent } from '../preventivo/preventivo-tarea-asignar/preventivo-tarea-asignar.component';
import { ImprimirTareaComponent } from '../preventivo/imprimir-tarea/imprimir-tarea.component';

@NgModule({
  declarations: [
    PreventivoComponent,
    CerrarOrdenPreventivaComponent,
    PreventivoItemComponent,
    PreventivoKitComponent,
    PreventivoUsoKitsComponent,
    PreventivoKitFormularioComponent,
    ReportePreventivoComponent,
    PreventivoTareaComponent,
    PreventivoTareaFormularioComponent,
    PreventivoTareaAsignarComponent,
    ImprimirTareaComponent
  ],
  imports: [
    CommonModule,
    RounavbarModule,
    PreventivorRoutingModule
  ],
  entryComponents: [
    PreventivoItemComponent,
    PreventivoKitComponent,
    PreventivoUsoKitsComponent,
    PreventivoKitFormularioComponent,
    ReportePreventivoComponent,
    PreventivoTareaFormularioComponent,
    PreventivoTareaAsignarComponent,
    ImprimirTareaComponent
  ]
})
export class PreventivorModule { }
