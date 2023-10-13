import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PreventivoComponent } from '../preventivo/preventivo.component';

import { CerrarOrdenPreventivaComponent } from '../cerrar-orden-preventiva/cerrar-orden-preventiva.component';
import { SolicitudPreventivaComponent } from '../solicitud-preventiva/solicitud-preventiva.component';

const routes: Routes = [
	{
		path: '',
		component: PreventivoComponent
	},
	{
		path: 'cerrar_od_pre/:caller',
		component: CerrarOrdenPreventivaComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class PreventivorRoutingModule { }
