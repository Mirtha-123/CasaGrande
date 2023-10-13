import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrdenservicioComponent } from '../ordenservicio/ordenservicio.component';
import { NuevasolicitudlistaComponent } from '../nuevasolicitudlista/nuevasolicitudlista.component';
import { CerrarodComponent } from '../cerrarod/cerrarod.component';
const routes: Routes = [
  {
    path: '',
    component: OrdenservicioComponent
  },
  {
    path: 'cerrar_od/:caller',
    component: CerrarodComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdenserviciorRoutingModule { }
