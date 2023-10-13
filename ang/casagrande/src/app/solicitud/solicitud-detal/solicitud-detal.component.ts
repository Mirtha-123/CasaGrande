import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PrincipalService } from 'src/app/servicio/principal.service';

declare var swal: any;

@Component({
  selector: 'app-solicitud-detal',
  templateUrl: './solicitud-detal.component.html',
  styleUrls: ['./solicitud-detal.component.css']
})
export class SolicitudDetalComponent implements OnInit {

  datos: any;
  item: any = {};
  constructor(
    public dialogRef: MatDialogRef<SolicitudDetalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public gServicio: PrincipalService
  ) {
    this.datos = data;
  }

  ngOnInit() {
    console.log(this.datos);

  }



  // CERRAR VENTANA
  onNoClick(): void {
    this.dialogRef.close(false);
  }

}
