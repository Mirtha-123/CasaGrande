import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChecklistComponent } from '../checklist/checklist.component';
import { ChecklistrRoutingModule } from './checklistr-routing.module';
import { RounavbarModule } from '../rounavbar/rounavbar.module'
import { ReporteComponent } from '../checklist/reporte/reporte.component';
import { ReporteDetalleComponent } from '../checklist/reporte-detalle/reporte-detalle.component';
import { NgxPrintModule } from 'ngx-print';

import { Imagen1Component } from '../checklist/imagen1/imagen1.component';
import { NgWhiteboardModule } from 'ng-whiteboard';
import { FormularioCComponent } from '../checklist/formulario-c/formulario-c.component';

import { ImageDrawingModule } from 'ngx-image-drawing';
import { Imagen2Component } from '../checklist/imagen2/imagen2.component';
import { Imagen4Component } from '../checklist/imagen4/imagen4.component';
import { Imagen3Component } from '../checklist/imagen3/imagen3.component';


@NgModule({


  declarations: [
    ChecklistComponent,
    ReporteComponent,
    ReporteDetalleComponent,
    Imagen1Component,
    Imagen2Component,
    Imagen3Component,
    Imagen4Component,
    FormularioCComponent,
  ],
  imports: [
    CommonModule,
    RounavbarModule,
    ChecklistrRoutingModule,
    NgxPrintModule,
    ImageDrawingModule

  ],
  entryComponents: [
    ReporteComponent,
    Imagen1Component,
    Imagen2Component,
    Imagen3Component,
    Imagen4Component,
    ReporteDetalleComponent
  ]
})
export class ChecklistrModule { }
