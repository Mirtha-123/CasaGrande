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
  selector: 'app-preventivo-item',
  templateUrl: './preventivo-item.component.html',
  styleUrls: ['./preventivo-item.component.css'],
  providers: [DatePipe]
})
export class PreventivoItemComponent implements OnInit {

  item: any = {};
  itemA: any = {};
  fecha = new Date();

  // SELECT
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};

  datos: any;
  constructor(
    public dialogRef: MatDialogRef<PreventivoItemComponent>,
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
    this.itemsDiversos();
    this.miItem();
  }

  itemsDiversos() {
    this.gServicio.itemsPreventivos().subscribe((respuesta) => {
      const elementos = [];
      respuesta.json().forEach(element => {
        elementos.push({ id: element._id, itemName: element.nombre + ' ' + element.descripcion });
      });
      console.log(elementos);
      this.dropdownList = elementos;
      console.log(respuesta.json());
    });
  }
  miItem() {
    this.gServicio.miItem(this.datos.bien).subscribe((respuesta) => {
      console.log(respuesta.json());
      if (respuesta.json().length > 0) {
        this.item = respuesta.json()[0];
        this.itemA = respuesta.json()[0];
      }
    });
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
    const x = {
      fecha: this.datePipe.transform(this.fecha, 'yyyy-MM-dd'),
      preventivo: this.datos.bien._id,
      itemA: this.itemA,
      item: this.selectedItems[0].id,
      usuario: this.cookieService.get('cokidemiproyecto')
    };
    console.log(x);
    this.gServicio.guardarItem(x).subscribe((respuesta) => {
      alert('Transferencia Completada');
      console.log(respuesta);
      //  this.finalizo();
    });
  }
  // CERRAR VENTANA
  onNoClick(): void {
    this.dialogRef.close(false);
  }

}
