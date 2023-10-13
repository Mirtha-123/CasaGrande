import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PrincipalService } from 'src/app/servicio/principal.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CookieService } from 'ngx-cookie-service';

declare var swal: any;


@Component({
  selector: 'app-reporte-detalle',
  templateUrl: './reporte-detalle.component.html',
  styleUrls: ['./reporte-detalle.component.css'],
  providers: [DatePipe]
})
export class ReporteDetalleComponent implements OnInit {
  datos: any = { bien: {} };
  detalle: any = [];
  constructor(
    public dialogRef: MatDialogRef<ReporteDetalleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public gServicio: PrincipalService,
    public dialog: MatDialog,
    private datePipe: DatePipe,
    private cookieService: CookieService,
  ) {
    this.datos = data;
  }

  ngOnInit() {
    console.log(this.datos)
    this.gServicio.dameElDetalle(this.datos.bien).subscribe((respuesta) => {
      console.log(respuesta.json());
      this.detalle = respuesta.json();
    });
  }

}
