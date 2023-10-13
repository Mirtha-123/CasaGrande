import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PrincipalService } from 'src/app/servicio/principal.service';

declare var swal: any;


@Component({
  selector: 'app-orden-imprimir',
  templateUrl: './orden-imprimir.component.html',
  styleUrls: ['./orden-imprimir.component.css']
})
export class OrdenImprimirComponent implements OnInit {
  datos: any;
  item: any = {};
  constructor(
    public dialogRef: MatDialogRef<OrdenImprimirComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public gServicio: PrincipalService
  ) {
    this.datos = data.orden;

  }

  ngOnInit() {
    console.log(this.datos);
  }

  // REGISTRAR
  onSubmit() {

  }

  // CERRAR VENTANA
  onNoClick(): void {
    this.dialogRef.close(false);
  }

}
