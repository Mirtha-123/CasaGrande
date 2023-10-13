import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContabilidadComponent } from '../contabilidad/contabilidad.component';
import { ReporteDosComponent } from '../contabilidad/reporte-dos/reporte-dos.component';
import { ReporteFinalComponent } from '../contabilidad/reporte-final/reporte-final.component';
import { ReporteUnoComponent } from '../contabilidad/reporte-uno/reporte-uno.component';


const routes: Routes = [
	{
		path: '',
		component: ContabilidadComponent
	},

	{
		path: 'reporte_ep',
		component: ReporteUnoComponent
	},
	{
		path: 'reporte_ep1',
		component: ReporteFinalComponent
	},
	{
		path: 'reporte_lb',
		component: ReporteDosComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ContabilidadrRoutingModule { }
