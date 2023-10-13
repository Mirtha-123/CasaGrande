import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PrincipalService } from 'src/app/servicio/principal.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CookieService } from 'ngx-cookie-service';

declare var swal: any;


@Component({
  selector: 'app-preventivo-uso-kits',
  templateUrl: './preventivo-uso-kits.component.html',
  styleUrls: ['./preventivo-uso-kits.component.css'],
  providers: [DatePipe]
})
export class PreventivoUsoKitsComponent implements OnInit {
  lista: any = [];
  item: any = {};
  itemA: any = {};
  fecha = new Date();

  // SELECT
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};

  datos: any;
  constructor(
    public dialogRef: MatDialogRef<PreventivoUsoKitsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public gServicio: PrincipalService,
    public dialog: MatDialog,
    public datePipe: DatePipe,
    private cookieService: CookieService
  ) {
    this.datos = data;
  }
  ngOnInit() {
    this.dropdownSettings = {
      singleSelection: true,
      text: 'Selecciona la Maquina',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      classes: 'myclass custom-class'
    };
    this.datePipe.transform(this.fecha, 'yyyy-MM-dd');
    console.log(this.datos);
    this.misKits();
    this.traerKits();
  }

  traerKits() {
    this.gServicio.kitLista().subscribe((respuesta) => {
      const elementos = [];
      respuesta.json().forEach(element => {
        elementos.push({ id: element._id, itemName: element.nombre });
      });
      console.log(elementos);
      this.dropdownList = elementos;
      console.log(respuesta.json());
    });
  }
  misKits() {
    this.gServicio.misKits(this.datos.bien).subscribe((respuesta) => {
      console.log(respuesta.json());
      if (respuesta.json().equipos != undefined) {
        respuesta.json().equipos.forEach(element => {
          this.lista.push({ id: element._id, nombre: element.nombre })
        });
      }
    });
  }

  agregarFila() {
    const x = { id: this.selectedItems[0].id, nombre: this.selectedItems[0].itemName }
    this.lista.push(x);
  }
  quitar(x) {
    const index = this.lista.indexOf(x);
    if (index > -1) {
      this.lista.splice(index, 1);
    }
  }
  onItemSelect(item: any) {
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


  guardar() {
    let x = { lista: [], preventivo: this.datos.bien };
    this.lista.forEach(element => {
      x.lista.push(element.id);
    });
    console.log(x);
    this.gServicio.guardarPaquete(x).subscribe((respuesta) => {
      alert('Kits Almacenado');
      console.log(respuesta);
      //  this.finalizo();
    });
  }
  // CERRAR VENTANA
  onNoClick(): void {
    this.dialogRef.close(false);
  }


}
