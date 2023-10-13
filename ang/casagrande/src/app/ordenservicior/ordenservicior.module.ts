import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RounavbarModule } from '../rounavbar/rounavbar.module';
import { SolicitudrModule } from '../solicitudr/solicitudr.module';
import { OrdenserviciorRoutingModule } from './ordenservicior-routing.module';
import { OrdenservicioComponent } from '../ordenservicio/ordenservicio.component';
import { NuevasolicitudlistaComponent } from '../nuevasolicitudlista/nuevasolicitudlista.component';
import { CerrarodComponent } from '../cerrarod/cerrarod.component';
import { OrdenReporteComponent } from '../ordenservicio/orden-reporte/orden-reporte.component';
import { OrdenImprimirComponent } from '../ordenservicio/orden-imprimir/orden-imprimir.component';
import { MantenimientosComponent } from '../ordenservicio/mantenimientos/mantenimientos.component';
import { MantenimientoFormularioComponent } from '../ordenservicio/mantenimientos/mantenimiento-formulario/mantenimiento-formulario.component';
import { MantenimientoReporteComponent } from '../ordenservicio/mantenimientos/mantenimiento-reporte/mantenimiento-reporte.component';
@NgModule({
  declarations: [
    CerrarodComponent,
    OrdenservicioComponent,
    OrdenReporteComponent,
    OrdenImprimirComponent,
    MantenimientosComponent,
    MantenimientoFormularioComponent,
    MantenimientoReporteComponent,
  ],
  imports: [
    CommonModule,
    RounavbarModule,
    OrdenserviciorRoutingModule
  ],
  entryComponents: [
    OrdenImprimirComponent,
    MantenimientosComponent,
    MantenimientoFormularioComponent,
    MantenimientoReporteComponent,
  ]
})
export class OrdenserviciorModule { }
