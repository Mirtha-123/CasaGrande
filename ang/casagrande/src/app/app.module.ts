import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router'
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { HashLocationStrategy, LocationStrategy } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';


import { NavbarModule, WavesModule, ButtonsModule } from 'angular-bootstrap-md'



import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MenuComponent } from './menu/menu.component';


import { PrincipalService } from './servicio/principal.service';
//import { BienComponent } from './bien/bien.component';
//import { NavbarComponent } from './navbar/navbar.component';
import { RounavbarModule } from './rounavbar/rounavbar.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EncargadosComponent } from './encargados/encargados.component';
import { UsuariosComponent } from './usuarios/usuarios.component';




import { FileSelectDirective, FileUploadModule } from 'ng2-file-upload';

import { AddComponent } from './nuevasolicitud/add/add.component';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { ProyectosComponent } from './proyectos/proyectos.component';



import { EditarperfilComponent } from './editarperfil/editarperfil.component';


import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

import { PushNotificationsModule } from 'ng-push';


import { NativeDateAdapter } from '@angular/material';
import { MatDateFormats } from '@angular/material/core';

import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';

import { MensajeService } from './mensaje/mensaje.service';

import { AsyncPipe } from '../../node_modules/@angular/common';
import { MatBadgeModule } from '@angular/material/badge';


import { MatRadioModule } from '@angular/material/radio';
import { ItemsComponent } from './bien/items/items.component';

import { NgxPrintModule } from 'ngx-print';
import { TransferirComponent } from './bien/transferir/transferir.component';
import { SolicitudPreventivaComponent } from './solicitud-preventiva/solicitud-preventiva.component';
import { PreventivoItemComponent } from './preventivo/preventivo-item/preventivo-item.component';
import { PreventivoKitComponent } from './preventivo/preventivo-kit/preventivo-kit.component';
import { PreventivoUsoKitsComponent } from './preventivo/preventivo-uso-kits/preventivo-uso-kits.component';
import { PreventivoKitFormularioComponent } from './preventivo/preventivo-kit/preventivo-kit-formulario/preventivo-kit-formulario.component';
import { ItemsFormularioComponent } from './bien/items-formulario/items-formulario.component';
import { ReporteTransferenciaComponent } from './bien/reporte-transferencia/reporte-transferencia.component';
import { ReportePreventivoComponent } from './preventivo/reporte-preventivo/reporte-preventivo.component';
import { OrdenReporteComponent } from './ordenservicio/orden-reporte/orden-reporte.component';
import { OrdenImprimirComponent } from './ordenservicio/orden-imprimir/orden-imprimir.component';
import { AuxiliarComponent } from './contabilidad/auxiliar/auxiliar.component';
import { AuxiliarFormularioComponent } from './contabilidad/auxiliar-formulario/auxiliar-formulario.component';
import { NotificacionesComponent } from './notificaciones/notificaciones.component';
import { ReporteUnoComponent } from './contabilidad/reporte-uno/reporte-uno.component';
import { PreventivoTareaComponent } from './preventivo/preventivo-tarea/preventivo-tarea.component';
import { PreventivoTareaFormularioComponent } from './preventivo/preventivo-tarea-formulario/preventivo-tarea-formulario.component';
import { PreventivoTareaAsignarComponent } from './preventivo/preventivo-tarea-asignar/preventivo-tarea-asignar.component';
import { ImprimirTareaComponent } from './preventivo/imprimir-tarea/imprimir-tarea.component';
import { SolicitudDetalleComponent } from './solicitud/solicitud-detalle/solicitud-detalle.component';
import { ReporteDosComponent } from './contabilidad/reporte-dos/reporte-dos.component';
import { SolicitudDetalComponent } from './solicitud/solicitud-detal/solicitud-detal.component';
import { ReporteComponent } from './checklist/reporte/reporte.component';
import { ReporteDetalleComponent } from './checklist/reporte-detalle/reporte-detalle.component';
import { ReporteFinalComponent } from './contabilidad/reporte-final/reporte-final.component';
import { NgWhiteboardModule } from 'ng-whiteboard';
import { Imagen1Component } from './checklist/imagen1/imagen1.component';
import { FormularioCComponent } from './checklist/formulario-c/formulario-c.component';
import { NuevoIngresoComponent } from './partesdiarios/nuevo-ingreso/nuevo-ingreso.component';
import { MantenimientosComponent } from './ordenservicio/mantenimientos/mantenimientos.component';
import { MantenimientoFormularioComponent } from './ordenservicio/mantenimientos/mantenimiento-formulario/mantenimiento-formulario.component';
import { MantenimientoReporteComponent } from './ordenservicio/mantenimientos/mantenimiento-reporte/mantenimiento-reporte.component';

const config: SocketIoConfig = { url: 'https://casagrande-erp.com', options: {} };


const rutas: Routes = [
  {

    path: 'login',
    component: LoginComponent
  },
  {

    path: 'perfil',
    component: EditarperfilComponent
  },
  {
    path: 'home',
    component: MenuComponent
  },
  {
    path: 'bienes_casagrande',
    loadChildren: './bienr/bienr.module#BienrModule'
  },
  {
    path: 'cargo',
    component: EncargadosComponent
  },
  {
    path: 'usuarios',
    component: UsuariosComponent
  },
  {
    path: 'activoFijo',
    loadChildren: './activo-fijo/activo-fijo.module#ActivoFijoModule'
  },

  {
    path: 'partes_diario',
    loadChildren: './partesdiariosr/partesdiariosr.module#PartesdiariosrModule'
  },
  {
    path: 'ordenes_servicio',
    loadChildren: './ordenservicior/ordenservicior.module#OrdenserviciorModule'
  },

  {
    path: 'sol_com',
    loadChildren: './solicitudr/solicitudr.module#SolicitudrModule'
  },
  {
    path: 'proy_cg',
    component: ProyectosComponent
  },
  {
    path: 'notificaciones',
    component: NotificacionesComponent
  },
  {
    path: 'preventivo_cg',
    loadChildren: './preventivor/preventivor.module#PreventivorModule'
  },
  {
    path: 'contabilidad',
    loadChildren: './contabilidadr/contabilidadr.module#ContabilidadrModule'
  },
  {
    path: 'check',
    loadChildren: './checklistr/checklistr.module#ChecklistrModule'
  }



]
@NgModule({
  exports: [
    MatBadgeModule
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    MenuComponent,
    EncargadosComponent,
    UsuariosComponent,

    AddComponent,
    ProyectosComponent,
    EditarperfilComponent,
    NotificacionesComponent
  ],
  imports: [
    RounavbarModule,
    BrowserModule,
    HttpClientModule,
    HttpModule,
    PushNotificationsModule,
    FileUploadModule,
    FormsModule,
    ReactiveFormsModule,
    NavbarModule,
    NgxPrintModule,
    WavesModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireMessagingModule,
    AngularFireModule.initializeApp(environment.firebase),
    ButtonsModule,

    RouterModule.forRoot(rutas, {
      preloadingStrategy: PreloadAllModules // <-This is our preloading
    }),
    SocketIoModule.forRoot(config),
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [MensajeService, AsyncPipe,
    { provide: LocationStrategy, useClass: HashLocationStrategy }, CookieService, PrincipalService],
  bootstrap: [AppComponent]
})
export class AppModule { }
