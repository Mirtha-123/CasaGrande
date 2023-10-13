import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PrincipalService } from 'src/app/servicio/principal.service';
import { PreventivoTareaComponent } from '../preventivo-tarea/preventivo-tarea.component';

declare var swal: any;

@Component({
  selector: 'app-imprimir-tarea',
  templateUrl: './imprimir-tarea.component.html',
  styleUrls: ['./imprimir-tarea.component.css']
})
export class ImprimirTareaComponent implements OnInit {
  fecha = new Date();
  datos: any;
  lista: any = [];
  kit: any;
  fila: any = {};
  item: any = {};

  prevenciones = [];
  // SELECT
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};

  // SELECT
  dropdownList1 = [];
  selectedItems1 = [];
  dropdownSettings1 = {};

  elegi: any;
  laliasta: any = [];
  prevencion: any = {};
  launica: any = {};
  constructor(
    public dialogRef: MatDialogRef<PreventivoTareaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public gServicio: PrincipalService
  ) {
    this.datos = data;
    console.log(this.datos);
  }

  ngOnInit() {
    this.gServicio.busquedaOrdenPreventiva(this.datos.bien).subscribe((respuesta) => {
      console.log(respuesta.json());
      this.launica = respuesta.json();
    });
    this.dropdownSettings = {
      singleSelection: true,
      text: 'Selecciona la Tarea',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      classes: 'myclass custom-class'
    };
    this.dropdownSettings1 = {
      singleSelection: true,
      text: 'Selecciona la Tarea',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      classes: 'myclass custom-class'
    };
    this.misTarea();
  }
  misTarea() {
    this.gServicio.verprevenciones1(this.datos.bien).subscribe((respuesta) => {
      console.log(respuesta.json());
      this.prevenciones = respuesta.json();
      let elementos = [];
      respuesta.json().forEach(element => {
        elementos.push({ id: element._id, itemName: element.nombre });
      });
      console.log(elementos);
      this.dropdownList = elementos;
    });
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
    const x = {
      nombre: this.kit,
      lista: this.lista
    }
    console.log(x);
    this.gServicio.agregarTarea(x).subscribe((respuesta) => {
      console.log(respuesta);
    });
  }
  onItemSelect1(item: any) {
    console.log(item);
    console.log(this.selectedItems);
    for (let index = 0; index < this.prevenciones.length; index++) {

      if (this.prevenciones[index]._id == item.id) {
        this.prevencion = this.prevenciones[index];
        this.elegi = this.prevenciones[index].tareas;
        let elementos = [];
        for (let index1 = 0; index1 < this.elegi.length; index1++) {
          elementos.push({ id: this.elegi[index1]._id, itemName: this.elegi[index1].nombre });

        }
        this.dropdownList1 = elementos;
      }
    }
    console.log('ELEGI', this.elegi);
  }
  OnItemDeSelect1(item: any) {
    console.log(item);
    console.log(this.selectedItems);
  }
  onItemSelect(item: any) {
    for (let index = 0; index < this.elegi.length; index++) {
      if (this.elegi[index]._id == item.id) {
        this.laliasta = this.elegi[index].lista;
      }

    }
    console.log(item);
    console.log(this.selectedItems);

  }
  OnItemDeSelect(item: any) {
    console.log(item);
    console.log(this.selectedItems);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  onDeSelectAll(items: any) {
    console.log(items);
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
