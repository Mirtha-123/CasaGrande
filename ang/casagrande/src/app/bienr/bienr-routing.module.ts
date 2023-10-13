import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BienComponent } from '../bien/bien.component';

const routes: Routes =[
	{
		path:'',
		component:BienComponent
	}
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BienrRoutingModule { }
