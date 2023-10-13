import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PrincipalService } from 'src/app/servicio/principal.service';

declare var swal: any;

@Component({
  selector: 'app-items-formulario',
  templateUrl: './items-formulario.component.html',
  styleUrls: ['./items-formulario.component.css']
})
export class ItemsFormularioComponent implements OnInit {
  datos: any;
  item: any = {};
  constructor(
    public dialogRef: MatDialogRef<ItemsFormularioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public gServicio: PrincipalService
  ) {
    this.datos = data;
    if (!this.datos.nuevo) {
      this.item = this.datos.item;
    }
  }

  ngOnInit() {
    console.log(this.datos);
    this.item.bien = this.datos.bien._id;
  }

  // REGISTRAR
  onSubmit() {
    console.log(this.item);

    if (this.datos.nuevo) {
      this.gServicio.agregarItem(this.item).subscribe((respuesta) => {
        console.log(respuesta);
        this.dialogRef.close(true);
        alert('Gracias se cargo correctamente!');
      });
    } else {
      this.gServicio.editarItem(this.item).subscribe((respuesta) => {
        console.log(respuesta);
        this.dialogRef.close(true);
        alert('Gracias se cargo correctamente!');
      });
    }



    console.log(this.item);
  }

  // CERRAR VENTANA
  onNoClick(): void {
    this.dialogRef.close(false);
  }
}
