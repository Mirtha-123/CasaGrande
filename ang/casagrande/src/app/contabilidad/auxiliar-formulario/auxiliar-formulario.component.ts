import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PrincipalService } from 'src/app/servicio/principal.service';

declare var swal: any;

@Component({
  selector: 'app-auxiliar-formulario',
  templateUrl: './auxiliar-formulario.component.html',
  styleUrls: ['./auxiliar-formulario.component.css']
})
export class AuxiliarFormularioComponent implements OnInit {

  datos: any;
  item: any = {};
  constructor(
    public dialogRef: MatDialogRef<AuxiliarFormularioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public gServicio: PrincipalService
  ) {
    this.datos = data;
  }

  ngOnInit() {
  }

  // REGISTRAR
  onSubmit() {
    console.log(this.item);
    if (this.datos.nuevo) {
      this.gServicio.agregarItem(this.item).subscribe((respuesta) => {
        console.log(respuesta);
        swal('Gracias se cargo correctamente!', 'Haz click en el boton!', 'success');
      });
    } else {
      this.gServicio.editarItem(this.item).subscribe((respuesta) => {
        console.log(respuesta);
        swal('Gracias se edito correctamente!', 'Haz click en el boton!', 'success');
      });
    }
    console.log(this.item);
  }

  // CERRAR VENTANA
  onNoClick(): void {
    this.dialogRef.close(false);
  }
}
