import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PrincipalService } from 'src/app/servicio/principal.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CookieService } from 'ngx-cookie-service';
import { ReporteDetalleComponent } from '../reporte-detalle/reporte-detalle.component';

declare var swal: any;

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.css'],
  providers: [DatePipe]

})
export class ReporteComponent implements OnInit {
  datos: any = {};
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  displayedColumns: string[] = ['motivo', 'fecha', 'usuario', 'observaciones', 'lugar', 'acciones'];

  ayuda: any;
  latabla: any = [];
  constructor(
    public dialogRef: MatDialogRef<ReporteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public gServicio: PrincipalService,
    public dialog: MatDialog,
    private datePipe: DatePipe,
    private cookieService: CookieService,
  ) {
    this.datos = data;
  }

  applyFilter(filterValue: string) {
    this.latabla.filter = filterValue.trim().toLowerCase();

    if (this.latabla.paginator) {
      this.latabla.paginator.firstPage();
    }
  }
  ngOnInit() {
    console.log(this.datos);
    this.gServicio.misCheck(this.datos.bien).subscribe((respuesta) => {
      console.log(respuesta.json());
      this.ayuda = respuesta.json();

      this.latabla = new MatTableDataSource(this.ayuda);
      this.latabla.paginator = this.paginator;
      this.latabla.sort = this.sort;
    })
  }
  masDetalle(x) {
    const dialogRef = this.dialog.open(ReporteDetalleComponent, {
      width: '80%',
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
  // CERRAR VENTANA
  onNoClick(): void {
    this.dialogRef.close(false);
  }
}
