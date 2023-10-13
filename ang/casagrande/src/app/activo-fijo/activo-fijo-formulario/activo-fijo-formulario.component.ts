import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PrincipalService } from 'src/app/servicio/principal.service';

declare var swal: any;
@Component({
  selector: 'app-activo-fijo-formulario',
  templateUrl: './activo-fijo-formulario.component.html',
  styleUrls: ['./activo-fijo-formulario.component.css']
})
export class ActivoFijoFormularioComponent implements OnInit {
  datos: any;
  item: any = {};
  constructor(
    public dialogRef: MatDialogRef<ActivoFijoFormularioComponent>,
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
        alert('Gracias se cargo correctamente!');
      });
    } else {
      this.gServicio.editarItem(this.item).subscribe((respuesta) => {
        console.log(respuesta);
        alert('Gracias se edito correctamente!');
      });
    }
    console.log(this.item);
  }

  // CERRAR VENTANA
  onNoClick(): void {
    this.dialogRef.close(false);
  }

}
