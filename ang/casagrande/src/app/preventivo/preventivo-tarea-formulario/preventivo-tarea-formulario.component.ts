import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PrincipalService } from 'src/app/servicio/principal.service';
import { PreventivoTareaComponent } from '../preventivo-tarea/preventivo-tarea.component';

declare var swal: any;

@Component({
  selector: 'app-preventivo-tarea-formulario',
  templateUrl: './preventivo-tarea-formulario.component.html',
  styleUrls: ['./preventivo-tarea-formulario.component.css']
})
export class PreventivoTareaFormularioComponent implements OnInit {
  datos: any;
  lista: any = [];
  kit: any;
  fila: any = {};
  item: any = {};
  constructor(
    public dialogRef: MatDialogRef<PreventivoTareaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public gServicio: PrincipalService
  ) {
    this.datos = data;
    if (this.datos.nuevo) {

    } else {
      this.kit = this.datos.tarea.nombre;
      this.lista = this.datos.tarea.lista;
    }
  }

  ngOnInit() {
  }

  agregarFila() {
    this.lista.push(this.fila.detalle);
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
      console.log(x);
      this.gServicio.agregarTarea(x).subscribe((respuesta) => {
        swal('Gracias se cargo correctamente!', 'Haz click en el boton!', 'success');
        this.dialogRef.close(true);
      });
    } else {
      const x = {
        nombre: this.kit,
        lista: this.lista,
        id: this.datos.tarea._id
      };
      console.log(x);
      this.gServicio.editarTarea(x).subscribe((respuesta) => {
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
