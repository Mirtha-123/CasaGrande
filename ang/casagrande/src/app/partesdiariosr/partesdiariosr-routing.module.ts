import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NuevoParteDiarioComponent } from '../nuevo-parte-diario/nuevo-parte-diario.component';
import { PartesdiariosComponent } from '../partesdiarios/partesdiarios.component';
const routes: Routes = [
	{
		path: '',
		component: PartesdiariosComponent
	},
	{
		path: 'nuevo',
		component: NuevoParteDiarioComponent
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class PartesdiariosrRoutingModule { }
