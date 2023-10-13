import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PrincipalService } from 'src/app/servicio/principal.service';
import * as moment from 'moment';
import { MatDialog } from '@angular/material';
import { OrdenImprimirComponent } from '../orden-imprimir/orden-imprimir.component';

declare var Tabulator: any;
declare var $: any;

@Component({
  selector: 'app-orden-reporte',
  templateUrl: './orden-reporte.component.html',
  styleUrls: ['./orden-reporte.component.css'],
  providers: [DatePipe]
})
export class OrdenReporteComponent implements OnInit {

  tablett: any;
  fecha: any = {};
  datos: any = [];
  datosSoli: any = [];


  cabecera: any = [
    { title: 'Fecha', field: 'fecha', width: 250 },
    { title: 'Fecha Salida', field: 'fechaSalida' },
    { title: 'Maquina', field: 'maquina', width: 200 },

    { title: 'Accion', field: 'tipo' },

    { title: 'Fecha S', field: 'fechaS', width: 250 },
    { title: 'Codigo S', field: 'codigoS' },
  ];



  constructor(
    private datePipe: DatePipe,
    public gServicio: PrincipalService,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
  }
  reporteTransferencia() {
    console.log(this.fecha);
    this.gServicio.reporteOrden({
      desde: this.datePipe.transform(this.fecha.desde, 'yyyy-MM-dd')
      , hasta: this.datePipe.transform(this.fecha.hasta, 'yyyy-MM-dd'),
    }).subscribe((respuesta) => {
      this.datos = respuesta.json().orden;
      this.datosSoli = respuesta.json().soli;
      for (let index = 0; index < this.datos.length; index++) {
        var t = [];
        for (let index1 = 0; index1 < this.datosSoli.length; index1++) {
          if (this.datosSoli[index1].orden) {
            if (this.datos[index]._id === this.datosSoli[index1].orden) {
              t.push(this.datosSoli[index1]);
            }
          }


        }
        this.datos[index].sol = t;

      }
      console.log(this.datos);
      this.tablaTabulator();

    });
  }

  limpieza() {
    $('#filter-field').val('');
    $('#filter-type').val('=');
    $('#filter-value').val('');

    this.tablett.clearFilter();
  }

  customFilter(data) {
    return data.car && data.rating < 3;
  }
  updateFilter() {

    const filter = $('#filter-field').val() === 'function' ? this.customFilter : $('#filter-field').val();

    if ($('#filter-field').val() === 'function') {
      $('#filter-type').prop('disabled', true);
      $('#filter-value').prop('disabled', true);
    } else {
      $('#filter-type').prop('disabled', false);
      $('#filter-value').prop('disabled', false);
    }

    this.tablett.setFilter(filter, $('#filter-type').val(), $('#filter-value').val());
  }
  tablaTabulator() {
    const x = [];
    this.datos.forEach(element => {
      const y: any = {
        fecha: 'F/Mantenimiento: ' + this.datePipe.transform(element.fecha, 'yyyy-MM-dd'),
        fechaSalida: this.datePipe.transform(element.fechasalida, 'yyyy-MM-dd'),
        maquina: element.maquina.nombre + '-' + element.maquina.descripcion,
        tipo: element.tipo,
        extra: element,
        _children: []
      };

      for (let index = 0; index < element.sol.length; index++) {
        var yy = {
          fecha: 'Fecha Solicitud: ' + element.sol[index].fecha,
          codigoS: element.sol[index].nombre,
          _children: []
        }

        for (let index1 = 0; index1 < element.sol[index].kit.length; index1++) {
          yy._children.push({
            fecha: (element.sol[index].kit[index1].completo) ? 'Comprado' : 'Incompleto',
            fechaSalida: element.sol[index].kit[index1].cantidad,
            maquina: element.sol[index].kit[index1].codigo,
            tipo: element.sol[index].kit[index1].nCantidad,
            fechaS: element.sol[index].kit[index1].descripcion,
            codigoS: element.sol[index].kit[index1].unidad,

          });

        }
        y._children.push(yy);
      }
      x.push(y);
    });

    this.tablett = new Tabulator('#example-table-tabulator', {
      data: x,
      printAsHtml: true,
      pagination: 'local',
      layout: 'fitColumns',
      dataTree: true,
      dataTreeStartExpanded: true,
      paginationSize: 50,
      selectable: 1,
      paginationSizeSelector: [10, 50, 100, 200],
      movableColumns: true,
      printHeader: `<h1>Casa Grande Constructora</h1><h3>Desde:
      ${moment(this.fecha.desde).format('MMMM Do YYYY')}
      a ${moment(this.fecha.hasta).format('MMMM Do YYYY')}</h3> `,
      printConfig: {
        columnGroups: true,
        rowGroups: true,
        columnCalcs: true,
      },
      columns: this.cabecera,
      rowSelectionChanged: (data, rows) => {
        //update selected row counter on selection change
        console.log(data);
        if (data.length > 0) {
          this.cambiarSeleccion(data[0]);

        }
      },
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

  cambiarSeleccion(x) {
    const dialogRef = this.dialog.open(OrdenImprimirComponent, {
      width: '80%',
      data: {
        orden: x
      },
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result) {
        this.ngOnInit();
      }
    });
  }

}
