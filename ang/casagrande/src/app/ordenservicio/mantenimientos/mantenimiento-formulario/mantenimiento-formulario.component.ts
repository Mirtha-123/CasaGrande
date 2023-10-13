import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PrincipalService } from 'src/app/servicio/principal.service';

declare var swal: any;


@Component({
  selector: 'app-mantenimiento-formulario',
  templateUrl: './mantenimiento-formulario.component.html',
  styleUrls: ['./mantenimiento-formulario.component.css']
})
export class MantenimientoFormularioComponent implements OnInit {

  datos: any;
  item: any = {};
  constructor(
    public dialogRef: MatDialogRef<MantenimientoFormularioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public gServicio: PrincipalService
  ) {
    this.datos = data;
    this.item.bien = this.datos.bien._id;
  }

  ngOnInit() {
    console.log(this.datos);

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
