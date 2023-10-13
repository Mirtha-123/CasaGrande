import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { PrincipalService } from 'src/app/servicio/principal.service';
import { DatePipe } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import * as moment from 'moment';

declare var swal: any;
declare var Tabulator: any;
declare var $: any;
@Component({
  selector: 'app-reporte-preventivo',
  templateUrl: './reporte-preventivo.component.html',
  styleUrls: ['./reporte-preventivo.component.css'],
  providers: [DatePipe]
})
export class ReportePreventivoComponent implements OnInit {

  tablett: any;

  cabecera: any = [
    { title: 'Id', field: 'id' },
    { title: 'Nombre', field: 'name' },
    { title: 'Mantanimiento Cada', field: 'cada' },
    { title: 'Proximo Mantenimiento', field: 'proximo' },
    { title: 'Dato Actual', field: 'actual' },
    {
      title: 'Restante para Mantenimiento', field: 'avance', formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        console.log('revision celda', value);
        if (value != undefined) {
          if (value < 0) {

            return '<span style="color: red; font - weight: bold; ">' + value + '</span>';


          } else {
            return value;
          }
        } else {
          return '';
        }
      }
    }

  ];



  datos: any = [];
  fecha = new Date();

  // SELECT
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};

  constructor(
    public gServicio: PrincipalService,
    public dialog: MatDialog,
    public datePipe: DatePipe,
    private cookieService: CookieService
  ) { }

  ngOnInit() {
    this.dropdownSettings = {
      singleSelection: false,
      text: 'Selecciona la Maquina',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      classes: 'myclass custom-class'
    };
    this.obtenerPosiblesDispositivos();
  }

  obtenerPosiblesDispositivos() {
    this.gServicio.bienes().subscribe((respuesta) => {
      console.log(respuesta.json());
      const elementos = [];
      respuesta.json().forEach(element => {
        elementos.push({ id: element._id, itemName: element.nombre + ' ' + element.descripcion });
      });
      console.log(elementos);
      this.dropdownList = elementos;
    });

  }

  reportar() {
    console.log(this.selectedItems);
    this.gServicio.reportePreventivo(this.selectedItems).subscribe((respuesta) => {
      console.log(respuesta.json());
      const todo = [];
      for (let index = 0; index < this.selectedItems.length; index++) {
        const y = {
          id: index + 1, name: this.selectedItems[index].itemName, '_children': [
          ]
        };
        let contador = 0;
        for (let index1 = 0; index1 < respuesta.json().length; index1++) {
          if (this.selectedItems[index].id == respuesta.json()[index1].bien._id) {
            contador++;
            y._children.push({
              id: index + 1 + '.' + contador,
              name: respuesta.json()[index1].nombre,
              proximo: respuesta.json()[index1].proximo,
              actual: respuesta.json()[index1].bien.horometro,
              cada: respuesta.json()[index1].anticipacion,
              aviso: respuesta.json()[index1].aviso,
              avance: parseFloat(respuesta.json()[index1].proximo) - parseFloat(respuesta.json()[index1].bien.horometro)
            });
          }

        }
        todo.push(y);
      }
      this.datos = todo;
      console.log(todo);

      this.traerArbol();
    });
  }
  traerArbol() {
    this.tablett = new Tabulator('#example-table-tabulator', {
      data: this.datos,
      printAsHtml: true,
      pagination: 'local',
      layout: 'fitColumns',
      paginationSize: 50,
      dataTreeCollapseElement: '<i class = "fas fa- minus - square"> </i>',
      dataTreeStartExpanded: true,
      dataTree: true,
      paginationSizeSelector: [10, 50, 100, 200],
      movableColumns: true,
      printHeader: `<h1>Casa Grande Constructora</h1>`,
      printConfig: {
        columnGroups: true,
        rowGroups: true,
        columnCalcs: true,
      },
      columns: this.cabecera,
    });

    $('#download-csv').click(() => {
      this.tablett.download('csv', 'data.csv');
    });


    $('#download-json').click(() => {
      this.tablett.download('json', 'data.json');
    });


    $('#download-xlsx').click(() => {
      this.tablett.download('xlsx', 'data.xlsx', { sheetName: 'My Data' });
    });

    $('#download-pdf').click(() => {
      this.tablett.download('pdf', 'data.pdf', {
        orientation: 'landscape',
        title: 'Example Report',
      });
    });
    $('#print-table').on('click', () => {
      this.tablett.print(false, true);
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


}
