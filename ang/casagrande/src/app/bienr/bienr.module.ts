import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BienComponent } from '../bien/bien.component';
import { RounavbarModule } from '../rounavbar/rounavbar.module'
import { BienrRoutingModule } from './bienr-routing.module';
import { CategoriasComponent } from '../categorias/categorias.component';
import { ItemsComponent } from '../bien/items/items.component';
import { TransferirComponent } from '../bien/transferir/transferir.component';
import { ItemsFormularioComponent } from '../bien/items-formulario/items-formulario.component';
import { ReporteTransferenciaComponent } from '../bien/reporte-transferencia/reporte-transferencia.component';


@NgModule({
  declarations: [
    BienComponent,
    CategoriasComponent,
    ItemsComponent,
    TransferirComponent,
    ItemsFormularioComponent,
    ReporteTransferenciaComponent
  ],
  imports: [
    RounavbarModule,
    CommonModule,
    BienrRoutingModule
  ],
  entryComponents: [
    ItemsComponent,
    TransferirComponent,
    ItemsFormularioComponent,
    ReporteTransferenciaComponent
  ]
})
export class BienrModule { }
