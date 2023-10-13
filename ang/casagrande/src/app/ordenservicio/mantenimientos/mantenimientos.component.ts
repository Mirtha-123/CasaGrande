import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PrincipalService } from '../../servicio/principal.service';
import { FormControl } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { FileUploader } from 'ng2-file-upload';
import { MatDialog } from '@angular/material/dialog';
import { MantenimientoFormularioComponent } from './mantenimiento-formulario/mantenimiento-formulario.component';
import { MantenimientoReporteComponent } from './mantenimiento-reporte/mantenimiento-reporte.component';

@Component({
  selector: 'app-mantenimientos',
  templateUrl: './mantenimientos.component.html',
  styleUrls: ['./mantenimientos.component.css']
})
export class MantenimientosComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  displayedColumns: string[] =
    ['semaforizacion', 'codigo', 'nombre', 'categoria', 'descripcion', 'horometro', 'hodometro', 'acciones'];
  latabla: any = [];
  ayuda: any;
  constructor(
    public api: PrincipalService,
    public dialog: MatDialog,
    private router: Router,
    private cookieService: CookieService
  ) { }

  ngOnInit() {
    this.api.bienes().subscribe((data) => {
      this.ayuda = data.json();
      console.log(data.json());
      this.latabla = new MatTableDataSource(this.ayuda);
      this.latabla.paginator = this.paginator;
      this.latabla.sort = this.sort;

    });
  }
  reporte(x) {
    const dialogRef = this.dialog.open(MantenimientoReporteComponent, {
      width: '70%',
      data: {
        bien: x,
      },
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

      }
    });
  }
  mantenimiento(x) {
    const dialogRef = this.dialog.open(MantenimientoFormularioComponent, {
      width: '70%',
      data: {
        bien: x,
      },
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

      }
    });
  }
  applyFilter(filterValue: string) {
    this.latabla.filter = filterValue.trim().toLowerCase();

    if (this.latabla.paginator) {
      this.latabla.paginator.firstPage();
    }
  }

}
