import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { PrincipalService } from 'src/app/servicio/principal.service';
import { DatePipe } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';

declare var swal: any;
@Component({
  selector: 'app-transferir',
  templateUrl: './transferir.component.html',
  styleUrls: ['./transferir.component.css'],
  providers: [DatePipe]
})
export class TransferirComponent implements OnInit {
  transferencia: any = {};

  fecha = new Date();

  // SELECT
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};

  datos: any;
  constructor(
    public dialogRef: MatDialogRef<TransferirComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public gServicio: PrincipalService,
    public dialog: MatDialog,
    public datePipe: DatePipe,
    private cookieService: CookieService
  ) {
    this.datos = data;
  }
  ngOnInit() {
    console.log(this.datos);
    this.dropdownSettings = {
      singleSelection: true,
      text: 'Selecciona la Maquina',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      classes: 'myclass custom-class'
    };
    this.datePipe.transform(this.fecha, 'yyyy-MM-dd');
    this.obtenerPosiblesDispositivos();
  }

  obtenerPosiblesDispositivos() {
    this.gServicio.listaDispositivos(this.datos).subscribe((respuesta) => {
      console.log(respuesta.json());
      const elementos = [];
      respuesta.json().forEach(element => {
        elementos.push({ id: element._id, itemName: element.nombre + ' ' + element.descripcion });
      });
      console.log(elementos);
      this.dropdownList = elementos;
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

  transferir() {
    const x = {
      fecha: this.datePipe.transform(this.fecha, 'yyyy-MM-dd'),
      bienN: this.selectedItems[0].id,
      bienA: this.datos.bien._id,
      horometroA: this.datos.bien.horometro,
      proximos: this.datos.item.preventivo,
      item: this.datos.item._id,
      observaciones: this.transferencia.observacion,
      transferencia: true,
      baja: false,
      usuario: this.cookieService.get('cokidemiproyecto')
    };
    console.log(x);
    this.gServicio.transferir(x).subscribe((respuesta) => {
      alert('Transferencia Completada');
      console.log(respuesta);
      this.finalizo();
    });
  }
  // CERRAR VENTANA
  finalizo(): void {
    this.dialogRef.close(true);
  }
  // CERRAR VENTANA
  onNoClick(): void {
    this.dialogRef.close(false);
  }

}
