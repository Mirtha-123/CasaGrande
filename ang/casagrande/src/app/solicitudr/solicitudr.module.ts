import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RounavbarModule } from '../rounavbar/rounavbar.module'
import { SolicitudrRoutingModule } from './solicitudr-routing.module';
import { SolicitudComponent } from '../solicitud/solicitud.component';

import { NuevasolicitudlistaComponent } from '../nuevasolicitudlista/nuevasolicitudlista.component';
import { NuevasolicitudComponent } from '../nuevasolicitud/nuevasolicitud.component';
import { SolicitudPreventivaComponent } from '../solicitud-preventiva/solicitud-preventiva.component';
import { SolicitudDetalleComponent } from '../solicitud/solicitud-detalle/solicitud-detalle.component';
import { SolicitudDetalComponent } from '../solicitud/solicitud-detal/solicitud-detal.component';
import { EditarSolicitudListaComponent } from '../editar-solicitud-lista/editar-solicitud-lista.component';

@NgModule({
  exports: [NuevasolicitudlistaComponent],
  declarations: [
    SolicitudComponent,
    NuevasolicitudlistaComponent,
    NuevasolicitudComponent,
    SolicitudPreventivaComponent,
    SolicitudDetalleComponent,
    SolicitudDetalComponent,
    EditarSolicitudListaComponent
  ],
  imports: [
    CommonModule,
    RounavbarModule,
    SolicitudrRoutingModule
  ],
  entryComponents: [
    SolicitudDetalleComponent,
    SolicitudDetalComponent,
    EditarSolicitudListaComponent]
})
export class SolicitudrModule { }