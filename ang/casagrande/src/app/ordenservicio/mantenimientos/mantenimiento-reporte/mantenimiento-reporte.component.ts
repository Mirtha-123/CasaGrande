import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PrincipalService } from 'src/app/servicio/principal.service';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

declare var swal: any;



@Component({
  selector: 'app-mantenimiento-reporte',
  templateUrl: './mantenimiento-reporte.component.html',
  styleUrls: ['./mantenimiento-reporte.component.css']
})
export class MantenimientoReporteComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  displayedColumns: string[] = ['fecha', 'detalle', 'horometro', 'lugar',
    'mecanico'];
  latabla: any = [];
  ayuda: any;

  datos: any;
  item: any = {};
  constructor(
    public dialogRef: MatDialogRef<MantenimientoReporteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public gServicio: PrincipalService
  ) {
    this.datos = data;
    this.item.bien = this.datos.bien._id;
  }

  ngOnInit() {
    console.log(this.datos);
    this.gServicio.traerMantenimientos(this.datos.bien).subscribe((respuesta) => {
      console.log(respuesta.json());
      this.ayuda = respuesta.json();
      console.log(respuesta.json());
      this.latabla = new MatTableDataSource(this.ayuda);
      this.latabla.paginator = this.paginator;
      this.latabla.sort = this.sort;
    });
  }

  applyFilter(filterValue: string) {
    this.latabla.filter = filterValue.trim().toLowerCase();

    if (this.latabla.paginator) {
      this.latabla.paginator.firstPage();
    }
  }
  // REGISTRAR
  onSubmit() {
    console.log(this.item);


    this.gServicio.mantenimientoN(this.item).subscribe((respuesta) => {
      console.log(respuesta);
      this.dialogRef.close(true);
      alert('Gracias se cargo correctamente!');
    });




    console.log(this.item);
  }

  // CERRAR VENTANA
  onNoClick(): void {
    this.dialogRef.close(false);
  }
}
