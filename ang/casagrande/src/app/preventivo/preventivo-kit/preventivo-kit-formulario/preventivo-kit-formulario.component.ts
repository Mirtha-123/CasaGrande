import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PrincipalService } from 'src/app/servicio/principal.service';

declare var swal: any;

@Component({
  selector: 'app-preventivo-kit-formulario',
  templateUrl: './preventivo-kit-formulario.component.html',
  styleUrls: ['./preventivo-kit-formulario.component.css']
})
export class PreventivoKitFormularioComponent implements OnInit {
  datos: any;
  lista: any = [];
  kit: any;
  fila: any = {};
  item: any = {};
  constructor(
    public dialogRef: MatDialogRef<PreventivoKitFormularioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public gServicio: PrincipalService
  ) {
    this.datos = data;
    console.log(this.datos);
    if (this.datos.nuevo) {

    } else {
      this.kit = this.datos.kit.nombre;
      this.lista = this.datos.kit.lista;
    }
  }

  ngOnInit() {
  }

  agregarFila() {
    var x = {
      cantidad: this.fila.cantidad,
      unidad: this.fila.unidad,
      numero: this.fila.numero,
      descripcion: this.fila.descripcion

    };
    this.lista.push(x);
  }
  quitar(x) {
    const index = this.lista.indexOf(x);
    if (index > -1) {
      this.lista.splice(index, 1);
    }
  }
  guardarKit() {

    if (this.datos.nuevo) {
      const x = {
        nombre: this.kit,
        lista: this.lista
      };
      this.gServicio.agregarKit(x).subscribe((respuesta) => {
        console.log(respuesta);
        alert('Gracias se cargo correctamente!');
        this.dialogRef.close(true);
      });
    } else {
      const x = {
        nombre: this.kit,
        lista: this.lista,
        id: this.datos.kit._id
      };
      this.gServicio.editarKit(x).subscribe((respuesta) => {
        console.log(respuesta);
        alert('Gracias se edito correctamente!');
        this.dialogRef.close(true);
      });
    }

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
