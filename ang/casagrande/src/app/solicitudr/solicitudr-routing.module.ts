import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SolicitudComponent } from '../solicitud/solicitud.component'
import { NuevasolicitudlistaComponent } from '../nuevasolicitudlista/nuevasolicitudlista.component';
import { NuevasolicitudComponent } from '../nuevasolicitud/nuevasolicitud.component';
import { SolicitudPreventivaComponent } from '../solicitud-preventiva/solicitud-preventiva.component';
import { EditarSolicitudListaComponent } from '../editar-solicitud-lista/editar-solicitud-lista.component';
const routes: Routes = [
  {
    path: '',
    component: SolicitudComponent,


  },
  {
    path: 'nueva_solicitud',
    component: NuevasolicitudComponent
  },
  {
    path: 'editar_solicitud_lista/:id',
    component: EditarSolicitudListaComponent
  }
  ,
  {
    path: 'nueva_solicitud_lista/:id',
    component: NuevasolicitudlistaComponent
  },
  {
    path: 'nueva_solicitud_lista_preventiva/:id',
    component: SolicitudPreventivaComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SolicitudrRoutingModule { }
