import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PrincipalService } from 'src/app/servicio/principal.service';
import * as moment from 'moment';

declare var Tabulator: any;
declare var $: any;
@Component({
  selector: 'app-reporte-transferencia',
  templateUrl: './reporte-transferencia.component.html',
  styleUrls: ['./reporte-transferencia.component.css'],
  providers: [DatePipe]
})
export class ReporteTransferenciaComponent implements OnInit {
  tablett: any;
  fecha: any = {};
  datos: any = [];



  cabecera: any = [
    { title: 'Fecha', field: 'fecha' },
    { title: 'Maquina Antigua', field: 'mA' },
    { title: 'Maquina Nueva', field: 'mN' },
    { title: 'Item', field: 'item' },
    { title: 'Observaciones', field: 'observaciones' },
    { title: 'Usuario', field: 'usuario' },
    { title: 'Accion', field: 'tipo' },
  ];



  constructor(
    private datePipe: DatePipe,
    public gServicio: PrincipalService
  ) { }

  ngOnInit() {
  }
  reporteTransferencia() {
    console.log(this.fecha);
    this.gServicio.reporteTransferencia({
      desde: this.datePipe.transform(this.fecha.desde, 'yyyy-MM-dd')
      , hasta: this.datePipe.transform(this.fecha.hasta, 'yyyy-MM-dd'),
    }).subscribe((respuesta) => {
      this.datos = respuesta.json();
      console.log(respuesta.json());
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
        fecha: element.fecha,
        mA: element.bienA.nombre + '-' + element.bienA.descripcion,
        item: element.item.codigo + '-' + element.item.nombre,
        observaciones: element.observaciones,
        usuario: element.usuario.nombre + '-' + element.usuario.apaterno
      };

      if (element.bienN) {
        y.mN = element.bienN.nombre + '-' + element.bienN.descripcion;
      }
      if (element.transferencia) {
        y.tipo = 'Transferencia';
      }
      if (element.baja) {
        y.tipo = 'Baja';
      }
      x.push(y);
    });

    this.tablett = new Tabulator('#example-table-tabulator', {
      data: x,
      printAsHtml: true,
      pagination: 'local',
      layout: 'fitColumns',
      paginationSize: 50,
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

}
