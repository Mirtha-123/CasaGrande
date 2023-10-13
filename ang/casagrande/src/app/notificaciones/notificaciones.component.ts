import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PrincipalService } from '../servicio/principal.service';
import { FormControl } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { FileUploader } from 'ng2-file-upload';

import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.css']
})
export class NotificacionesComponent implements OnInit {


  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  displayedColumns: string[] = ['fecha', 'tema', 'acciones'];
  latabla: any = [];
  ayuda: any;
  constructor(
    public api: PrincipalService,
    private router: Router,
    private cookieService: CookieService,
    public dialog: MatDialog,

  ) { }

  ngOnInit() {
    this.obtener();
  }

  applyFilter(filterValue: string) {
    this.latabla.filter = filterValue.trim().toLowerCase();

    if (this.latabla.paginator) {
      this.latabla.paginator.firstPage();
    }
  }
  borrar(x) {
    console.log("booro");
    this.api.yaLaVi({ usu: this.cookieService.get('cokidemiproyecto'), noti: x }).subscribe((respuesta) => {
      this.obtener();
    });
  }
  quitarTodo() {
    this.api.quitarNotificaciones(this.cookieService.get('cokidemiproyecto')).subscribe((respuesta) => {
      console.log(respuesta.json());
      this.obtener();
    });
  }

  obtener() {
    this.api.NotificacionesListaPersonal(this.cookieService.get('cokidemiproyecto')).subscribe((data) => {
      this.ayuda = data.json();
      console.log(data.json());
      this.latabla = new MatTableDataSource(this.ayuda);
      this.latabla.paginator = this.paginator;
      this.latabla.sort = this.sort;
    });
  }


}
