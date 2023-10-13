import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChecklistComponent } from '../checklist/checklist.component';
import { FormularioCComponent } from '../checklist/formulario-c/formulario-c.component';
const routes: Routes = [
	{
		path: '',
		component: ChecklistComponent,

	},
	{
		path: 'formularioC/:id',
		component: FormularioCComponent,

	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ChecklistrRoutingModule { }
