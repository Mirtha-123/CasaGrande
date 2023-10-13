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
import { ActivoFijoFormularioComponent } from './activo-fijo-formulario/activo-fijo-formulario.component';

@Component({
  selector: 'app-activo-fijo',
  templateUrl: './activo-fijo.component.html',
  styleUrls: ['./activo-fijo.component.css']
})
export class ActivoFijoComponent implements OnInit {


  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  displayedColumns: string[] = ['nombre', 'codigo', 'codigoEmpresa', 'descripcion', 'marca', 'estado', 'bien', 'acciones'];
  latabla: any = [];
  ayuda: any;
  constructor(
    public api: PrincipalService,
    private router: Router,
    private cookieService: CookieService,
    public dialog: MatDialog
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

  obtener() {
    this.api.ItemListaGeneral().subscribe((data) => {
      this.ayuda = data.json();
      console.log(data.json());
      this.latabla = new MatTableDataSource(this.ayuda);
      this.latabla.paginator = this.paginator;
      this.latabla.sort = this.sort;
    });
  }

  limpiar() {
    const dialogRef = this.dialog.open(ActivoFijoFormularioComponent, {
      width: '80%',
      data: {
        nuevo: true,
        cliente: null
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.obtener();
      }
    });

  }

}
