import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RounavbarModule } from '../rounavbar/rounavbar.module'
import { ContabilidadrRoutingModule } from './contabilidadr-routing.module';
import { ContabilidadComponent } from '../contabilidad/contabilidad.component';
import { AuxiliarComponent } from '../contabilidad/auxiliar/auxiliar.component';
import { AuxiliarFormularioComponent } from '../contabilidad/auxiliar-formulario/auxiliar-formulario.component';
import { ReporteUnoComponent } from '../contabilidad/reporte-uno/reporte-uno.component';
import { ReporteDosComponent } from '../contabilidad/reporte-dos/reporte-dos.component';
import { ReporteFinalComponent } from '../contabilidad/reporte-final/reporte-final.component';
@NgModule({
  declarations: [
    ContabilidadComponent,
    AuxiliarComponent,
    AuxiliarFormularioComponent,
    ReporteUnoComponent,
    ReporteDosComponent,
    ReporteFinalComponent
  ],
  imports: [
    RounavbarModule,
    CommonModule,
    ContabilidadrRoutingModule
  ],
  entryComponents: [
    AuxiliarFormularioComponent,
    ReporteUnoComponent
  ]
})
export class ContabilidadrModule { }
