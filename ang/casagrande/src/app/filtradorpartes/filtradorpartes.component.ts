import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PrincipalService } from '../servicio/principal.service'
import { FormControl } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { Chart } from 'chart.js';
import * as moment from 'moment';

declare var $: any;
declare var swal: any;
declare var Swal: any;
declare var XLSX: any;
declare var Tabulator: any;
@Component({
  selector: 'app-filtradorpartes',
  templateUrl: './filtradorpartes.component.html',
  styleUrls: ['./filtradorpartes.component.css']
})
export class FiltradorpartesComponent implements OnInit {
  observacionesFinales: any = '';
  cargando = false;
  categorizar: false;
  firmas: any = [];
  lafirma: any = '';
  elcargo: any;
  laaccion: any;


  // tslint:disable-next-line: member-ordering
  cabecera: any = [
    { title: 'Codigo', field: 'codigo' },
    { title: 'Bien', field: 'bien' },
    {
      title: 'Proyecto', field: 'proyecto', bottomCalcFormatter: function (values, data, calcParams) {

        return "<span id='aqui' >Sub Total</span>";
      },
    },
    {
      title: 'Horas', field: 'horas', bottomCalc: 'sum', bottomCalcFormatterParams: function (values) {
        var value = values.getValue();
        return "<span class='pedro' >" + parseFloat(value).toFixed(2) + "</span>";
      }, bottomCalcParams: { precision: 2 },
      formatterParams: { decimal: '.', precision: 2, symbol: '' }
    },
    { title: 'Dias', field: 'dias', bottomCalc: 'sum', bottomCalcParams: { precision: 2 } },
    { title: 'Kms', field: 'km', bottomCalc: 'sum', bottomCalcParams: { precision: 2 } },
    { title: 'Traslado', field: 'traslados', bottomCalc: 'sum', bottomCalcParams: { precision: 2 } },
    { title: 'Otro', field: 'otro', bottomCalc: 'sum', bottomCalcParams: { precision: 2 } },
    { title: 'Cubo', field: 'cubo', bottomCalc: 'sum', bottomCalcParams: { precision: 2 } },
    { title: 'Precio', field: 'precio' },
    { title: 'Moneda', field: 'moneda' },
    { title: 'Total Ganado', field: 'costo', bottomCalc: 'sum', formatter: 'money', formatterParams: { decimal: '.', precision: 2, symbol: '' }, bottomCalcParams: { precision: 2 } },
    { title: 'Cantidad Diesel', field: 'cantidaddiesel', bottomCalc: 'sum', bottomCalcParams: { precision: 2 } },
    { title: 'Precio Diesel', field: 'preciodiesel', bottomCalc: 'sum', bottomCalcParams: { precision: 2 } },
    { title: 'Moneda Diesel', field: 'monedadiesel' },
    { title: 'Total Diesel', field: 'totaldiesel', bottomCalc: 'sum', formatter: 'money', formatterParams: { decimal: '.', precision: 2, symbol: '' }, bottomCalcParams: { precision: 2 } },

    { title: 'Cantidad Gasolina', field: 'cantidadgasolina', bottomCalc: 'sum', bottomCalcParams: { precision: 2 } },
    { title: 'Precio Gasolina', field: 'preciogasolina', bottomCalc: 'sum', bottomCalcParams: { precision: 2 } },
    { title: 'Moneda Gasolina', field: 'monedagasolina', bottomCalc: 'sum', bottomCalcParams: { precision: 2 } },
    { title: 'Total Gasolina', field: 'totalgasolina', bottomCalc: 'sum', formatter: 'money', formatterParams: { decimal: '.', precision: 2, symbol: '' }, bottomCalcParams: { precision: 2 } },

    { title: 'Descuento Repuestos', field: 'descuentorepuesto' },
    { title: 'Mantenimiento', field: 'descuentomantenimiento' },
    { title: 'Sueldos', field: 'descuentosueldos' },
    { title: 'Ropa', field: 'descuentoropa' },
    { title: 'Diesel', field: 'descuentodiesel' },
    { title: 'Otros', field: 'descuentootro' },
    { title: 'O/I', field: 'otroIngreso', bottomCalc: 'sum', formatter: 'money', formatterParams: { decimal: '.', precision: 2, symbol: '' }, bottomCalcParams: { precision: 2 } },
    { title: 'Total Descuentos', field: 'totaldescuentos', bottomCalc: 'sum', formatter: 'money', formatterParams: { decimal: '.', precision: 2, symbol: '' }, bottomCalcParams: { precision: 2 } },
    { title: 'Liquido Pagable', field: 'liquidopagable', bottomCalc: 'sum', formatter: 'money', formatterParams: { decimal: '.', precision: 2, symbol: '' }, bottomCalcParams: { precision: 2 } },
  ];
  losprint: any = [];
  losnoprint: any = [];
  seleccionado: any;
  seleccionado1: any;
  table_t: any;


  fir: any = {};
  foo: any;
  los: any = [];
  desde: any;
  hasta: any;



  dropdownList1 = [];
  selectedItems1 = [];
  dropdownSettings1 = {};
  itemsbienes1 = []

  dropdownList2 = [];
  selectedItems2 = [];
  dropdownSettings2 = {};
  itemsbienes2 = []
  mitabla: any = []
  miarchivo: any = {}
  onItemSelect1(item: any) {
    console.log(item);
    console.log(this.selectedItems1);
  }
  OnItemDeSelect1(item: any) {
    console.log(item);
    console.log(this.selectedItems1);
  }
  onSelectAll1(items: any) {
    console.log(items);
  }
  onDeSelectAll1(items: any) {
    console.log(items);
  }
  anadidura() {
    this.los.push(JSON.stringify(this.fir))
  }

  constructor(public api: PrincipalService, private router: Router, private cookieService: CookieService) { }


  verCategorizar() {
    console.log(this.categorizar);
  }
  ngOnInit() {
    
    this.api.informacionfiltrada().subscribe((data) => {
      console.log(data.json());
      this.multiproyectos(data.json().proyectos);
      this.multibienes(data.json().bienes);
    });
  }
  multiproyectos(x) {
    this.itemsbienes1 = [];
    var y = {};

    for (var i = x.length - 1; i >= 0; i--) {
      y = {
        'id': i,
        'itemName': x[i].codigo + ' ' + x[i].nombre,
        'value': x[i]._id
      }
      this.itemsbienes1.push(y);
    }
    this.dropdownSettings1 = {
      singleSelection: true,
      text: 'Selecciona los Proyectos',
      selectAllText: 'Elegir todos',
      unSelectAllText: 'Quitar todos',
      enableSearchFilter: true,
      classes: 'myclass custom-class'
    };
  }
  multibienes(x) {
    this.itemsbienes2 = [];
    var y = {};

    for (var i = x.length - 1; i >= 0; i--) {
      y = {
        'id': i,
        'itemName': x[i].codigo + ' ' + x[i].nombre,
        'value': x[i]._id
      }
      this.itemsbienes2.push(y)
    }
    this.dropdownSettings2 = {
      singleSelection: false,
      text: 'Selecciona los Bienes',
      selectAllText: 'Elegir todos',
      unSelectAllText: 'Quitar todos',
      enableSearchFilter: true,
      classes: 'myclass custom-class'
    };
  }
  buscar() {
    this.mitabla = [];
    var variosMetodos: [];
    var maquinas = [];
    var maquina1 = [];
    var partes = [];
    var otrosIngresos = [];
    var proyecto = [];
    var proyecto1 = [];
    var des = [];
    var x = {
      proyectos: this.selectedItems1,
      bienes: this.selectedItems2,
      desde: this.desde,
      hasta: this.hasta
    };
    console.log(x);
    this.api.buscarsolicitud(x).subscribe((datas) => {
      console.log(datas.json());
      partes = datas.json().parte;
      des = datas.json().descuento;
      otrosIngresos = datas.json().otro;
      this.api.solicitarcostodeproyecto(x).subscribe((data) => {
        
        var unaayuda = data.json();
        var costobienes = data.json().costobien;
        var unaayudadediesel = data.json().costodiesel;
        console.log(data.json(), datas.json().parte);
        for (var i = datas.json().parte.length - 1; i >= 0; i--) {
          maquinas.push(datas.json().parte[i].maquina._id);
          proyecto.push(datas.json().parte[i].proyecto._id);
        }


        proyecto1 = proyecto.filter((valor, indiceActual, arreglo) => arreglo.indexOf(valor) === indiceActual);
        maquina1 = maquinas.filter((valor, indiceActual, arreglo) => arreglo.indexOf(valor) === indiceActual);
        console.log(maquina1, proyecto1);
        for (var ii = maquina1.length - 1; ii >= 0; ii--) {
          var contadorOtroIngreso=0
          console.log('--------MAQUINA-------'+maquina1[ii])
          let lineas = [];
          let contadorCosto = 0;
          
          for (let index = 0; index < costobienes.length; index++) {
            if (costobienes[index].bien == null) {
              console.log(costobienes[index])
            }
            if (String(maquina1[ii]) === String(costobienes[index].bien._id)) {

              if (contadorCosto === 0) {
                for (var ia = proyecto1.length - 1; ia >= 0; ia--) {
                  var kms: any = 0;
                  var cubos: any = 0;
                  var otro: any = 0;
                  var traslado: any = 0;
                  var horashabiles: any = 0;
                  var horashabiles: any = 0;
                  var contardias: any = 0;
                  var diacontado: any = 0;
                  var gasolinacantidad: any = 0;
                  var gasolinatotal: any = 0;
                  var dieselcantidad: any = 0;
                  var dieseltotal: any = 0;
                  var descuentorepuesto: any = 0;
                  var descuentomantenimiento: any = 0;
                  var descuentosueldos: any = 0;
                  var descuentoropa: any = 0;
                  var descuentodiesel: any = 0;
                  var descuentootro: any = 0;
                  var dieselDescuentoC = 0;
                  var OtroIngreso: any = 0;
                  var pr: any = {};


                  for (var ib = partes.length - 1; ib >= 0; ib--) {
                    if (partes[ib].maquina._id == maquina1[ii] && partes[ib].proyecto._id == proyecto1[ia] && costobienes[index].tipo == partes[ib].metododepago) {

                      if (partes[ib].habiles == ' ' || partes[ib].habiles == null || partes[ib].habiles == '') {
                        partes[ib].habiles = 0;
                      }
                      if (partes[ib].dia == ' ' || partes[ib].dia == null || partes[ib].dia == '') {
                        partes[ib].dia = 0;
                      }
                      if (partes[ib].km == ' ' || partes[ib].km == null || partes[ib].km == '') {
                        partes[ib].km = 0;
                      }
                      if (partes[ib].traslado == ' ' || partes[ib].traslado == null || partes[ib].traslado == '') {
                        partes[ib].traslado = 0;
                      }
                      if (partes[ib].cubos == ' ' || partes[ib].cubos == null || partes[ib].cubos == '') {
                        partes[ib].cubos = 0;
                      }
                      if (partes[ib].otro == ' ' || partes[ib].otro == null || partes[ib].otro == '') {
                        partes[ib].otro = 0;
                      }

                      if (partes[ib].diesel == ' ' || partes[ib].diesel == null || partes[ib].diesel == '') {
                        partes[ib].diesel = 0;
                      }
                      if (partes[ib].gasolina == ' ' || partes[ib].gasolina == null || partes[ib].gasolina == '') {
                        partes[ib].gasolina = 0;
                      }



                      kms = parseFloat(kms) + parseFloat(partes[ib].km);
                      otro = parseFloat(otro) + parseFloat(partes[ib].otro);
                      cubos = parseFloat(cubos) + parseFloat(partes[ib].cubos);
                      traslado = parseFloat(traslado) + parseFloat(partes[ib].traslado);
                      horashabiles = parseFloat(horashabiles) + parseFloat(partes[ib].habiles);
                      contardias = contardias + 1;
                      diacontado = parseFloat(diacontado) + parseFloat(partes[ib].dia);
                      gasolinatotal = parseFloat(gasolinatotal) + parseFloat(partes[ib].gasolina);
                      dieseltotal = parseFloat(dieseltotal) + parseFloat(partes[ib].diesel);
                     
                      if (partes[ib].dieselpagado == 'obra') {
                        dieselcantidad = parseFloat(dieselcantidad) + parseFloat(partes[ib].diesel);
                        gasolinacantidad = parseFloat(gasolinacantidad) + parseFloat(partes[ib].gasolina);
                      }




                    } else if (partes[ib].maquina._id == maquina1[ii] && partes[ib].proyecto._id == proyecto1[ia] && partes[ib].metododepago == undefined) {
                      if (partes[ib].habiles == ' ' || partes[ib].habiles == null || partes[ib].habiles == '') {
                        partes[ib].habiles = 0;
                      }
                      if (partes[ib].dia == ' ' || partes[ib].dia == null || partes[ib].dia == '') {
                        partes[ib].dia = 0;
                      }
                      if (partes[ib].km == ' ' || partes[ib].km == null || partes[ib].km == '') {
                        partes[ib].km = 0;
                      }
                      if (partes[ib].traslado == ' ' || partes[ib].traslado == null || partes[ib].traslado == '') {
                        partes[ib].traslado = 0;
                      }
                      if (partes[ib].cubos == ' ' || partes[ib].cubos == null || partes[ib].cubos == '') {
                        partes[ib].cubos = 0;
                      }
                      if (partes[ib].otro == ' ' || partes[ib].otro == null || partes[ib].otro == '') {
                        partes[ib].otro = 0;
                      }

                      if (partes[ib].diesel == ' ' || partes[ib].diesel == null || partes[ib].diesel == '') {
                        partes[ib].diesel = 0;
                      }
                      if (partes[ib].gasolina == ' ' || partes[ib].gasolina == null || partes[ib].gasolina == '') {
                        partes[ib].gasolina = 0;
                      }

                      kms = parseFloat(kms) + parseFloat(partes[ib].km);
                      otro = parseFloat(otro) + parseFloat(partes[ib].otro);
                      cubos = parseFloat(cubos) + parseFloat(partes[ib].cubos);
                      traslado = parseFloat(traslado) + parseFloat(partes[ib].traslado);
                      horashabiles = parseFloat(horashabiles) + parseFloat(partes[ib].habiles);
                      contardias = contardias + 1;
                      diacontado = parseFloat(diacontado) + parseFloat(partes[ib].dia);
                      dieseltotal = parseFloat(dieseltotal) + parseFloat(partes[ib].diesel);
                      gasolinatotal = parseFloat(gasolinatotal) + parseFloat(partes[ib].gasolina);
                      if (partes[ib].dieselpagado == 'obra') {
                        dieselcantidad = parseFloat(dieselcantidad) + parseFloat(partes[ib].diesel);
                        gasolinacantidad = parseFloat(gasolinacantidad) + parseFloat(partes[ib].gasolina);
                      }
                    }

                  }
                  if (contadorOtroIngreso ==0 ) {
                    for (let indexO = 0; indexO < otrosIngresos.length; indexO++) {
                      if (otrosIngresos[indexO].bien == maquina1[ii] && otrosIngresos[indexO].proyecto == proyecto1[ia]) {
                        OtroIngreso = parseFloat(OtroIngreso) + parseFloat(otrosIngresos[indexO].monto);
                      }
  
                    }
                  }
                  
                  for (var iaa = des.length - 1; iaa >= 0; iaa--) {
                    if (des[iaa].bien == maquina1[ii] && des[iaa].proyecto == proyecto1[ia]) {
                      switch (des[iaa].tipo) {
                        case 'repuesto':
                          descuentorepuesto = parseFloat(descuentorepuesto) + parseFloat(des[iaa].precio);
                          break;
                        case 'mantenimiento':
                          descuentomantenimiento = parseFloat(descuentomantenimiento) + parseFloat(des[iaa].precio);
                          break;
                        case 'sueldos':
                          descuentosueldos = parseFloat(descuentosueldos) + parseFloat(des[iaa].precio);
                          break;
                        case 'ropa':
                          descuentoropa = parseFloat(descuentoropa) + parseFloat(des[iaa].precio);
                          break;
                        case 'diesel':
                          descuentodiesel = parseFloat(descuentodiesel) + parseFloat(des[iaa].precio);
                          break;
                        case 'otros':
                          descuentootro = parseFloat(descuentootro) + parseFloat(des[iaa].precio);
                          break;
                        default:
                          // code...
                          break;
                      }
                    }
                  }
                  pr.moneda = costobienes[index].moneda;
                  pr.precio = parseFloat(costobienes[index].precio).toFixed(2);
                  pr.tipo = costobienes[index].tipo;
                  pr.maquina = costobienes[index].bien.nombre;
                  pr.categoria = costobienes[index].bien.categoria;
                  pr.proyecto = costobienes[index].proyecto.nombre;
                  pr.descripcion = costobienes[index].bien.descripcion;
                  pr.codigo = costobienes[index].bien.codigo;
                  pr.otroIngreso = OtroIngreso;
                  /*for (var ic = unaayuda.costobien.length - 1; ic >= 0; ic--) {
                    if (unaayuda.costobien[ic].bien != null) {
                      if (unaayuda.costobien[ic].bien._id == maquina1[ii] && unaayuda.costobien[ic].proyecto._id == proyecto1[ia]) {
                        console.log('entre')
                        pr.moneda = data.json().costobien[ic].moneda;
                        pr.precio = data.json().costobien[ic].precio;
                        pr.tipo = data.json().costobien[ic].tipo;
                        pr.maquina = data.json().costobien[ic].bien.nombre;
                        pr.proyecto = data.json().costobien[ic].proyecto.nombre;
                        pr.descripcion = data.json().costobien[ic].bien.descripcion;
                        pr.codigo = data.json().costobien[ic].bien.codigo;
                      }
                    } else {
 
                    }
 
                  }*/


                  // AQUI ME QUEDE
                  for (var ic = unaayudadediesel.length - 1; ic >= 0; ic--) {

                    if (unaayudadediesel[ic].bien ==null) {
                      console.log(unaayudadediesel[ic])
                    }
                    if (unaayudadediesel[ic].bien._id == maquina1[ii] && unaayudadediesel[ic].proyecto._id == proyecto1[ia]) {
                      console.log(unaayudadediesel[ic]);
                      if (data.json().costodiesel[ic].tipo == 'gasolina') {
                        pr.monedagasolina = data.json().costodiesel[ic].moneda;
                        pr.preciogasolina = parseFloat(data.json().costodiesel[ic].precio);
                        pr.monedadiesel = '0';
                        pr.preciodiesel = '0';
                        break;
                      } else {
                        pr.monedadiesel = data.json().costodiesel[ic].moneda;
                        pr.preciodiesel = parseFloat(data.json().costodiesel[ic].precio);
                        pr.monedagasolina = '0';
                        pr.preciogasolina = '0';
                        break;
                      }

                    } else {

                      pr.monedadiesel = '0';
                      pr.preciodiesel = '0';
                      pr.monedagasolina = '0';
                      pr.preciogasolina = '0';

                    }
                  }
                  if (pr.tipo == 'dia') {
                    console.log(pr)
                    var xx = {
                      codigo: pr.codigo,
                      bien: pr.maquina + ' ' + pr.descripcion,
                      categoria: pr.categoria,
                      proyecto: pr.proyecto,
                      horas: 0,
                      dias: diacontado,
                      km: kms,
                      traslados: 0,
                      cubo: 0,
                      otro: 0,
                      moneda: pr.moneda,
                      precio: pr.precio,
                      costo: parseFloat(diacontado) * parseFloat(pr.precio),
                      monedadiesel: pr.monedadiesel,
                      preciodiesel: pr.preciodiesel,
                      monedagasolina: pr.monedagasolina,
                      preciogasolina: pr.preciogasolina,
                      cantidadgasolina: parseFloat(gasolinatotal).toFixed(2),
                      cantidaddiesel: parseFloat(dieseltotal),
                      totalgasolina: parseFloat(gasolinatotal) * parseFloat(pr.preciogasolina),
                      totaldiesel: parseFloat(dieseltotal) * parseFloat(pr.preciodiesel),
                      descuentomantenimiento: descuentomantenimiento,
                      descuentorepuesto: descuentorepuesto,
                      descuentosueldos: descuentosueldos,
                      descuentoropa: descuentoropa,
                      descuentodiesel: descuentodiesel,
                      descuentootro: descuentootro,
                      otroIngreso: OtroIngreso,
                      totaldescuentos: parseFloat(descuentomantenimiento) + parseFloat(descuentorepuesto) + parseFloat(descuentoropa) + parseFloat(descuentosueldos) + parseFloat(descuentodiesel) + parseFloat(descuentootro),
                      liquidopagable: (parseFloat(diacontado) * parseFloat(pr.precio))
                        - (parseFloat(descuentomantenimiento) + parseFloat(descuentorepuesto) +
                          parseFloat(descuentoropa) + parseFloat(descuentosueldos) + parseFloat(descuentodiesel) +
                          parseFloat(descuentootro)) - (parseFloat(pr.preciodiesel) * parseFloat(dieselcantidad)) - (parseFloat(pr.preciogasolina) * parseFloat(gasolinacantidad)) + parseFloat(OtroIngreso)

                    }
                    this.mitabla.push(JSON.stringify(xx))
                  } else if (pr.tipo == 'hora') {
                    console.log('HORAS', pr)
                    var xxq = {
                      codigo: pr.codigo,
                      bien: pr.maquina + ' ' + pr.descripcion,
                      proyecto: pr.proyecto,
                      categoria: pr.categoria,
                      horas: parseFloat(horashabiles).toFixed(2),
                      dias: 0,
                      km: kms,
                      traslados: 0,
                      cubo: 0,
                      otro: 0,
                      moneda: pr.moneda,
                      precio: pr.precio,
                      costo: parseFloat(horashabiles) * parseFloat(pr.precio),
                      monedadiesel: pr.monedadiesel,
                      preciodiesel: pr.preciodiesel,
                      monedagasolina: pr.monedagasolina,
                      preciogasolina: pr.preciogasolina,
                      cantidadgasolina: gasolinatotal,
                      cantidaddiesel: parseFloat(dieseltotal).toFixed(2),
                      totalgasolina: parseFloat(gasolinatotal) * parseFloat(pr.preciogasolina),
                      totaldiesel: parseFloat(dieseltotal) * parseFloat(pr.preciodiesel),
                      descuentomantenimiento: descuentomantenimiento,
                      descuentorepuesto: descuentorepuesto,
                      descuentosueldos: descuentosueldos,
                      descuentoropa: descuentoropa,
                      descuentodiesel: descuentodiesel,
                      descuentootro: descuentootro,
                      otroIngreso: OtroIngreso,
                      totaldescuentos: parseFloat(descuentomantenimiento) + parseFloat(descuentorepuesto) + parseFloat(descuentoropa) + parseFloat(descuentosueldos) + parseFloat(descuentodiesel) + parseFloat(descuentootro),
                      liquidopagable: (parseFloat(horashabiles) * parseFloat(pr.precio)) - (parseFloat(descuentomantenimiento) + parseFloat(descuentorepuesto) + parseFloat(descuentoropa) + parseFloat(descuentosueldos) + parseFloat(descuentodiesel) + parseFloat(descuentootro)) - (parseFloat(pr.preciodiesel) * parseFloat(dieselcantidad)) - (parseFloat(pr.preciogasolina) * parseFloat(gasolinacantidad)) + parseFloat(OtroIngreso)
                    }
                    this.mitabla.push(JSON.stringify(xxq))
                  } else if (pr.tipo == 'km') {
                    var xxqx = {
                      codigo: pr.codigo,
                      bien: pr.maquina + ' ' + pr.descripcion,
                      proyecto: pr.proyecto,
                      categoria: pr.categoria,
                      horas: 0,
                      dias: 0,
                      km: kms,
                      traslados: 0,
                      cubo: 0,
                      otro: 0,
                      moneda: pr.moneda,
                      precio: pr.precio,
                      costo: parseFloat(kms) * parseFloat(pr.precio),
                      monedadiesel: pr.monedadiesel,
                      preciodiesel: pr.preciodiesel,
                      monedagasolina: pr.monedagasolina,
                      preciogasolina: pr.preciogasolina,
                      cantidadgasolina: gasolinatotal,
                      cantidaddiesel: parseFloat(dieseltotal).toFixed(2),
                      totalgasolina: parseFloat(gasolinatotal) * parseFloat(pr.preciogasolina),
                      totaldiesel: parseFloat(dieseltotal) * parseFloat(pr.preciodiesel),
                      descuentomantenimiento: descuentomantenimiento,
                      descuentorepuesto: descuentorepuesto,
                      descuentosueldos: descuentosueldos,
                      descuentoropa: descuentoropa,
                      descuentodiesel: descuentodiesel,
                      descuentootro: descuentootro,
                      otroIngreso: OtroIngreso,
                      totaldescuentos: parseFloat(descuentomantenimiento) + parseFloat(descuentorepuesto) + parseFloat(descuentoropa) + parseFloat(descuentosueldos) + parseFloat(descuentodiesel) + parseFloat(descuentootro),
                      liquidopagable: (parseFloat(kms) * parseFloat(pr.precio)) - (parseFloat(descuentomantenimiento) + parseFloat(descuentorepuesto) + parseFloat(descuentoropa) + parseFloat(descuentosueldos) + parseFloat(descuentodiesel) + parseFloat(descuentootro)) - (parseFloat(pr.preciodiesel) * parseFloat(dieselcantidad)) - (parseFloat(pr.preciogasolina) * parseFloat(gasolinacantidad)) + parseFloat(OtroIngreso)
                    }
                    this.mitabla.push(JSON.stringify(xxqx));
                  } else if (pr.tipo == 'traslado') {
                    var xxqxx = {
                      codigo: pr.codigo,
                      bien: pr.maquina + ' ' + pr.descripcion,
                      proyecto: pr.proyecto,
                      categoria: pr.categoria,
                      horas: 0,
                      dias: 0,
                      km: 0,
                      traslados: traslado,
                      cubo: 0,
                      otro: 0,
                      moneda: pr.moneda,
                      precio: pr.precio,
                      costo: parseFloat(traslado) * parseFloat(pr.precio),
                      monedadiesel: pr.monedadiesel,
                      preciodiesel: pr.preciodiesel,
                      monedagasolina: pr.monedagasolina,
                      preciogasolina: pr.preciogasolina,
                      cantidadgasolina: gasolinatotal,
                      cantidaddiesel: parseFloat(dieseltotal).toFixed(2),
                      totalgasolina: parseFloat(gasolinatotal) * parseFloat(pr.preciogasolina),
                      totaldiesel: parseFloat(dieseltotal) * parseFloat(pr.preciodiesel),
                      descuentomantenimiento: descuentomantenimiento,
                      descuentorepuesto: descuentorepuesto,
                      descuentosueldos: descuentosueldos,
                      descuentoropa: descuentoropa,
                      descuentodiesel: descuentodiesel,
                      descuentootro: descuentootro,
                      otroIngreso: OtroIngreso,
                      totaldescuentos: parseFloat(descuentomantenimiento) + parseFloat(descuentorepuesto) + parseFloat(descuentoropa) + parseFloat(descuentosueldos) + parseFloat(descuentodiesel) + parseFloat(descuentootro),
                      liquidopagable: (parseFloat(traslado) * parseFloat(pr.precio)) - (parseFloat(descuentomantenimiento) + parseFloat(descuentorepuesto) + parseFloat(descuentoropa) + parseFloat(descuentosueldos) + parseFloat(descuentodiesel) + parseFloat(descuentootro)) - (parseFloat(pr.preciodiesel) * parseFloat(dieselcantidad)) - (parseFloat(pr.preciogasolina) * parseFloat(gasolinacantidad)) + parseFloat(OtroIngreso)
                    }
                    this.mitabla.push(JSON.stringify(xxqxx));
                  } else if (pr.tipo == 'cubo') {
                    var xxqxxx = {
                      codigo: pr.codigo,
                      bien: pr.maquina + ' ' + pr.descripcion,
                      proyecto: pr.proyecto,
                      categoria: pr.categoria,
                      horas: 0,
                      dias: 0,
                      km: 0,
                      traslados: 0,
                      cubo: cubos,
                      otro: 0,
                      moneda: pr.moneda,
                      precio: pr.precio,
                      costo: parseFloat(cubos) * parseFloat(pr.precio),
                      monedadiesel: pr.monedadiesel,
                      preciodiesel: pr.preciodiesel,
                      monedagasolina: pr.monedagasolina,
                      preciogasolina: pr.preciogasolina,
                      cantidadgasolina: gasolinatotal,
                      cantidaddiesel: parseFloat(dieseltotal).toFixed(2),
                      totalgasolina: parseFloat(gasolinatotal) * parseFloat(pr.preciogasolina),
                      totaldiesel: parseFloat(dieseltotal) * parseFloat(pr.preciodiesel),
                      descuentomantenimiento: descuentomantenimiento,
                      descuentorepuesto: descuentorepuesto,
                      descuentosueldos: descuentosueldos,
                      descuentoropa: descuentoropa,
                      descuentodiesel: descuentodiesel,
                      descuentootro: descuentootro,
                      otroIngreso: OtroIngreso,
                      totaldescuentos: parseFloat(descuentomantenimiento) + parseFloat(descuentorepuesto) + parseFloat(descuentoropa) + parseFloat(descuentosueldos) + parseFloat(descuentodiesel) + parseFloat(descuentootro),
                      liquidopagable: (parseFloat(cubos) * parseFloat(pr.precio)) - (parseFloat(descuentomantenimiento) + parseFloat(descuentorepuesto) + parseFloat(descuentoropa) + parseFloat(descuentosueldos) + parseFloat(descuentodiesel) + parseFloat(descuentootro)) - (parseFloat(pr.preciodiesel) * parseFloat(dieselcantidad)) - (parseFloat(pr.preciogasolina) * parseFloat(gasolinacantidad)) + parseFloat(OtroIngreso)
                    }
                    this.mitabla.push(JSON.stringify(xxqxxx));
                  } else if (pr.tipo == 'otro') {
                    var xxqxq = {
                      codigo: pr.codigo,
                      bien: pr.maquina + ' ' + pr.descripcion,
                      proyecto: pr.proyecto,
                      categoria: pr.categoria,
                      horas: 0,
                      dias: 0,
                      km: 0,
                      traslados: 0,
                      cubo: 0,
                      otro: otro,
                      moneda: pr.moneda,
                      precio: pr.precio,
                      costo: parseFloat(otro) * parseFloat(pr.precio),
                      monedadiesel: pr.monedadiesel,
                      preciodiesel: pr.preciodiesel,
                      monedagasolina: pr.monedagasolina,
                      preciogasolina: pr.preciogasolina,
                      cantidadgasolina: gasolinatotal,
                      cantidaddiesel: parseFloat(dieseltotal).toFixed(2),
                      totalgasolina: parseFloat(gasolinatotal) * parseFloat(pr.preciogasolina),
                      totaldiesel: parseFloat(dieseltotal) * parseFloat(pr.preciodiesel),
                      descuentomantenimiento: descuentomantenimiento,
                      descuentorepuesto: descuentorepuesto,
                      descuentosueldos: descuentosueldos,
                      descuentoropa: descuentoropa,
                      descuentodiesel: descuentodiesel,
                      descuentootro: descuentootro,
                      otroIngreso: OtroIngreso,
                      totaldescuentos: parseFloat(descuentomantenimiento) + parseFloat(descuentorepuesto) + parseFloat(descuentoropa) + parseFloat(descuentosueldos) + parseFloat(descuentodiesel) + parseFloat(descuentootro),
                      liquidopagable: (parseFloat(otro) * parseFloat(pr.precio)) - (parseFloat(descuentomantenimiento) + parseFloat(descuentorepuesto) + parseFloat(descuentoropa) + parseFloat(descuentosueldos) + parseFloat(descuentodiesel) + parseFloat(descuentootro)) - (parseFloat(pr.preciodiesel) * parseFloat(dieselcantidad)) - (parseFloat(pr.preciogasolina) * parseFloat(gasolinacantidad)) + parseFloat(OtroIngreso)
                    }
                    this.mitabla.push(JSON.stringify(xxqxq));
                  }



                }
              } else {

                for (var ia = proyecto1.length - 1; ia >= 0; ia--) {
                  var kms: any = 0;
                  var cubos: any = 0;
                  var otro: any = 0;
                  var traslado: any = 0;
                  var horashabiles: any = 0;
                  var horashabiles: any = 0;
                  var contardias: any = 0;
                  var diacontado: any = 0;

                  var gasolinacantidad: any = 0;
                  var gasolinatotal: any = 0;

                  var dieselcantidad: any = 0;
                  var dieseltotal: any = 0;
                  var descuentorepuesto: any = 0;
                  var descuentomantenimiento: any = 0;
                  var descuentosueldos: any = 0;
                  var descuentoropa: any = 0;
                  var descuentodiesel: any = 0;
                  var descuentootro: any = 0;
                  var OtroIngreso: any = 0;
                  var pr: any = {};


                  for (var ib = partes.length - 1; ib >= 0; ib--) {
                    if (partes[ib].maquina._id == maquina1[ii] && partes[ib].proyecto._id == proyecto1[ia] && costobienes[index].tipo == partes[ib].metododepago) {

                      if (partes[ib].habiles == ' ' || partes[ib].habiles == null) {
                        partes[ib].habiles = 0;
                      }
                      if (partes[ib].dia == ' ' || partes[ib].dia == null) {
                        partes[ib].dia = 0;
                      }
                      if (partes[ib].km == ' ' || partes[ib].km == null) {
                        partes[ib].km = 0;
                      }
                      if (partes[ib].traslado == ' ' || partes[ib].traslado == null) {
                        partes[ib].traslado = 0;
                      }
                      if (partes[ib].cubos == ' ' || partes[ib].cubos == null) {
                        partes[ib].cubos = 0;
                      }
                      if (partes[ib].otro == ' ' || partes[ib].otro == null) {
                        partes[ib].otro = 0;
                      }

                      if (partes[ib].gasolina == ' ' || partes[ib].gasolina == null) {
                        partes[ib].gasolina = 0;
                      }
                      if (partes[ib].diesel == ' ' || partes[ib].diesel == null) {
                        partes[ib].diesel = 0;
                      }

                      kms = parseFloat(kms) + parseFloat(partes[ib].km);
                      otro = parseFloat(otro) + parseFloat(partes[ib].otro);
                      cubos = parseFloat(cubos) + parseFloat(partes[ib].cubos);
                      traslado = parseFloat(traslado) + parseFloat(partes[ib].traslado);
                      horashabiles = parseFloat(horashabiles) + parseFloat(partes[ib].habiles);
                      contardias = contardias + 1;
                      diacontado = parseFloat(diacontado) + parseFloat(partes[ib].dia);
                      dieseltotal = parseFloat(dieseltotal) + parseFloat(partes[ib].diesel);
                      gasolinatotal = parseFloat(gasolinatotal) + parseFloat(partes[ib].gasolina);
                      if (partes[ib].dieselpagado == 'obra') {
                        dieselcantidad = parseFloat(dieselcantidad) + parseFloat(partes[ib].diesel);
                        gasolinacantidad = parseFloat(gasolinacantidad) + parseFloat(partes[ib].gasolina);
                      }




                    }

                  }
                  for (var iaa = des.length - 1; iaa >= 0; iaa--) {
                    if (des[iaa].bien == maquina1[ii] && des[iaa].proyecto == proyecto1[ia]) {
                      switch (des[iaa].tipo) {
                        case 'repuesto':
                          descuentorepuesto = parseFloat(descuentorepuesto) + parseFloat(des[iaa].precio);
                          break;
                        case 'mantenimiento':
                          descuentomantenimiento = parseFloat(descuentomantenimiento) + parseFloat(des[iaa].precio);
                          break;
                        case 'sueldos':
                          descuentosueldos = parseFloat(descuentosueldos) + parseFloat(des[iaa].precio);
                          break;
                        case 'ropa':
                          descuentoropa = parseFloat(descuentoropa) + parseFloat(des[iaa].precio);
                          break;
                        case 'diesel':
                          descuentodiesel = parseFloat(descuentodiesel) + parseFloat(des[iaa].precio);
                          break;
                        case 'otros':
                          descuentootro = parseFloat(descuentootro) + parseFloat(des[iaa].precio);
                          break;
                        default:
                          // code...
                          break;
                      }
                    }
                  }
                  if (contadorOtroIngreso==0) {
                    for (let indexO = 0; indexO < otrosIngresos.length; indexO++) {
                      if (otrosIngresos[indexO].bien == maquina1[ii] && otrosIngresos[indexO].proyecto == proyecto1[ia]) {
                        OtroIngreso = parseFloat(OtroIngreso) + parseFloat(otrosIngresos[indexO].monto);
                      }
  
                    }
                  }
                 


                  pr.moneda = costobienes[index].moneda;
                  pr.precio = costobienes[index].precio;
                  pr.tipo = costobienes[index].tipo;
                  pr.maquina = costobienes[index].bien.nombre;
                  pr.categoria = costobienes[index].bien.categoria;
                  pr.proyecto = costobienes[index].proyecto.nombre;
                  pr.descripcion = costobienes[index].bien.descripcion;
                  pr.codigo = costobienes[index].bien.codigo;
                  pr.otroIngreso = OtroIngreso;
                  /*for (var ic = unaayuda.costobien.length - 1; ic >= 0; ic--) {
                    if (unaayuda.costobien[ic].bien != null) {
                      if (unaayuda.costobien[ic].bien._id == maquina1[ii] && unaayuda.costobien[ic].proyecto._id == proyecto1[ia]) {
                        console.log('entre')
                        pr.moneda = data.json().costobien[ic].moneda;
                        pr.precio = data.json().costobien[ic].precio;
                        pr.tipo = data.json().costobien[ic].tipo;
                        pr.maquina = data.json().costobien[ic].bien.nombre;
                        pr.proyecto = data.json().costobien[ic].proyecto.nombre;
                        pr.descripcion = data.json().costobien[ic].bien.descripcion;
                        pr.codigo = data.json().costobien[ic].bien.codigo;
                      }
                    } else {
 
                    }
 
                  }*/
                  for (var ic = unaayudadediesel.length - 1; ic >= 0; ic--) {

                    if (unaayudadediesel[ic].bien._id == maquina1[ii] && unaayudadediesel[ic].proyecto._id == proyecto1[ia]) {
                      console.log(unaayudadediesel[ic]);
                      if (data.json().costodiesel[ic].tipo == 'gasolina') {
                        pr.monedagasolina = data.json().costodiesel[ic].moneda;
                        pr.preciogasolina = parseFloat(data.json().costodiesel[ic].precio);
                        pr.monedadiesel = '0';
                        pr.preciodiesel = '0';
                        break;
                      } else {
                        pr.monedadiesel = data.json().costodiesel[ic].moneda;
                        pr.preciodiesel = parseFloat(data.json().costodiesel[ic].precio);
                        pr.monedagasolina = '0';
                        pr.preciogasolina = '0';
                        break;
                      }

                    } else {

                      pr.monedadiesel = '0';
                      pr.preciodiesel = '0';
                      pr.monedagasolina = '0';
                      pr.preciogasolina = '0';

                    }
                  }
                  if (pr.tipo == 'dia') {
                    console.log(pr)
                    var xx1 = {
                      codigo: pr.codigo,
                      bien: pr.maquina + ' ' + pr.descripcion,
                      proyecto: pr.proyecto,
                      categoria: pr.categoria,
                      horas: 0,
                      dias: diacontado,
                      km: kms,
                      traslados: 0,
                      cubo: 0,
                      otro: 0,
                      moneda: pr.moneda,
                      precio: pr.precio,
                      costo: parseFloat(diacontado) * parseFloat(pr.precio),
                      monedadiesel: 0,
                      preciodiesel: 0,
                      cantidaddiesel: 0,
                      totaldiesel: 0,
                      monedagasolina: 0,
                      preciogasolina: 0,
                      cantidadgasolina: 0,
                      totalgasolina: 0,
                      descuentomantenimiento: 0,
                      descuentorepuesto: 0,
                      descuentosueldos: 0,
                      descuentoropa: 0,
                      descuentodiesel: 0,
                      descuentootro: 0,
                      otroIngreso: OtroIngreso,
                      totaldescuentos: 0,
                      liquidopagable: (parseFloat(diacontado) * parseFloat(pr.precio)) + parseFloat(OtroIngreso)

                    };
                    this.mitabla.push(JSON.stringify(xx1));
                  } else if (pr.tipo == 'hora') {
                    console.log(pr)
                    var xxq1 = {
                      codigo: pr.codigo,
                      bien: pr.maquina + ' ' + pr.descripcion,
                      proyecto: pr.proyecto,
                      horas: parseFloat(horashabiles).toFixed(2),
                      categoria: pr.categoria,
                      dias: 0,
                      km: kms,
                      traslados: 0,
                      cubo: 0,
                      otro: 0,
                      moneda: pr.moneda,
                      precio: pr.precio,
                      monedadiesel: 0,
                      preciodiesel: 0,
                      cantidaddiesel: 0,
                      totaldiesel: 0,
                      monedagasolina: 0,
                      preciogasolina: 0,
                      cantidadgasolina: 0,
                      totalgasolina: 0,
                      descuentomantenimiento: 0,
                      descuentorepuesto: 0,
                      descuentosueldos: 0,
                      descuentoropa: 0,
                      descuentodiesel: 0,
                      descuentootro: 0,
                      otroIngreso: OtroIngreso,
                      totaldescuentos: 0,
                      liquidopagable: (parseFloat(horashabiles) * parseFloat(pr.precio)) + parseFloat(OtroIngreso)
                    };
                    this.mitabla.push(JSON.stringify(xxq1))
                  } else if (pr.tipo == 'km') {
                    var xxqx1 = {
                      codigo: pr.codigo,
                      bien: pr.maquina + ' ' + pr.descripcion,
                      proyecto: pr.proyecto,
                      categoria: pr.categoria,
                      horas: 0,
                      dias: 0,
                      km: kms,
                      traslados: 0,
                      cubo: 0,
                      otro: 0,
                      moneda: pr.moneda,
                      precio: pr.precio,
                      costo: parseFloat(kms) * parseFloat(pr.precio),
                      monedadiesel: 0,
                      preciodiesel: 0,
                      cantidaddiesel: 0,
                      totaldiesel: 0,
                      monedagasolina: 0,
                      preciogasolina: 0,
                      cantidadgasolina: 0,
                      totalgasolina: 0,
                      descuentomantenimiento: 0,
                      descuentorepuesto: 0,
                      descuentosueldos: 0,
                      descuentoropa: 0,
                      descuentodiesel: 0,
                      descuentootro: 0,
                      otroIngreso: OtroIngreso,
                      totaldescuentos: 0,
                      liquidopagable: (parseFloat(kms) * parseFloat(pr.precio)) + parseFloat(OtroIngreso)
                    };
                    this.mitabla.push(JSON.stringify(xxqx1));
                  } else if (pr.tipo == 'traslado') {
                    var xxqxx1 = {
                      codigo: pr.codigo,
                      bien: pr.maquina + ' ' + pr.descripcion,
                      proyecto: pr.proyecto,
                      categoria: pr.categoria,
                      horas: 0,
                      dias: 0,
                      km: 0,
                      traslados: traslado,
                      cubo: 0,
                      otro: 0,
                      moneda: pr.moneda,
                      precio: pr.precio,
                      costo: parseFloat(traslado) * parseFloat(pr.precio),
                      monedadiesel: 0,
                      preciodiesel: 0,
                      cantidaddiesel: 0,
                      totaldiesel: 0,
                      monedagasolina: 0,
                      preciogasolina: 0,
                      cantidadgasolina: 0,
                      totalgasolina: 0,
                      descuentomantenimiento: 0,
                      descuentorepuesto: 0,
                      descuentosueldos: 0,
                      descuentoropa: 0,
                      descuentodiesel: 0,
                      descuentootro: 0,
                      otroIngreso: OtroIngreso,
                      totaldescuentos: 0,
                      liquidopagable: (parseFloat(traslado) * parseFloat(pr.precio)) + parseFloat(OtroIngreso)
                    };
                    this.mitabla.push(JSON.stringify(xxqxx1));
                  } else if (pr.tipo == 'cubo') {
                    var xxqxxx1 = {
                      codigo: pr.codigo,
                      bien: pr.maquina + ' ' + pr.descripcion,
                      proyecto: pr.proyecto,
                      categoria: pr.categoria,
                      horas: 0,
                      dias: 0,
                      km: 0,
                      traslados: 0,
                      cubo: cubos,
                      otro: 0,
                      moneda: pr.moneda,
                      precio: pr.precio,
                      costo: parseFloat(cubos) * parseFloat(pr.precio),
                      monedadiesel: 0,
                      preciodiesel: 0,
                      cantidaddiesel: 0,
                      totaldiesel: 0,
                      monedagasolina: 0,
                      preciogasolina: 0,
                      cantidadgasolina: 0,
                      totalgasolina: 0,
                      descuentomantenimiento: 0,
                      descuentorepuesto: 0,
                      descuentosueldos: 0,
                      descuentoropa: 0,
                      descuentodiesel: 0,
                      descuentootro: 0,
                      otroIngreso: OtroIngreso,
                      totaldescuentos: 0,
                      liquidopagable: (parseFloat(cubos) * parseFloat(pr.precio)) + parseFloat(OtroIngreso)
                    };
                    this.mitabla.push(JSON.stringify(xxqxxx1));
                  } else if (pr.tipo == 'otro') {
                    var xxqxq1 = {
                      codigo: pr.codigo,
                      bien: pr.maquina + ' ' + pr.descripcion,
                      proyecto: pr.proyecto,
                      categoria: pr.categoria,
                      horas: 0,
                      dias: 0,
                      km: 0,
                      traslados: 0,
                      cubo: 0,
                      otro: otro,
                      moneda: pr.moneda,
                      precio: pr.precio,
                      costo: parseFloat(otro) * parseFloat(pr.precio),
                      monedadiesel: 0,
                      preciodiesel: 0,
                      cantidaddiesel: 0,
                      totaldiesel: 0,
                      monedagasolina: 0,
                      preciogasolina: 0,
                      cantidadgasolina: 0,
                      totalgasolina: 0,
                      descuentomantenimiento: 0,
                      descuentorepuesto: 0,
                      descuentosueldos: 0,
                      descuentoropa: 0,
                      descuentodiesel: 0,
                      descuentootro: 0,
                      otroIngreso: OtroIngreso,
                      totaldescuentos: 0,
                      liquidopagable: (parseFloat(otro) * parseFloat(pr.precio)) + parseFloat(OtroIngreso)
                    };
                    this.mitabla.push(JSON.stringify(xxqxq1));
                  }

                  

                }


              }
              contadorOtroIngreso =1;
              contadorCosto = 1;
            }
            
          }
          console.log(lineas);
         
         


        }

        for (var id = this.mitabla.length - 1; id >= 0; id--) {
          this.mitabla[id] = JSON.parse(this.mitabla[id])
        }

        this.agregarlatabla();
      })
    })

  }
  agregarlatabla() {
    var sumita: any = 0;
    var descue: any = 0;
    for (let index = 0; index < this.mitabla.length; index++) {
      sumita = parseFloat(sumita) + parseFloat(this.mitabla[index].liquidopagable);
      descue = parseFloat(descue) + parseFloat(this.mitabla[index].liquidopagable);
    }
    let to = 12 / this.firmas.length;
    console.log(to);
    if (to < 3) {
      to = 3;
    }
    const datoFirmas = [];
    var pie = '<div class="col-md-12"><h1> TOTAL: ' + parseFloat(sumita).toFixed(2) + ' </h1> </div><div class="col-md-12"><p>' + this.observacionesFinales + '</p></div> <div class="row" style="margin-top: 150px;">  ';

    for (let index = 0; index < this.firmas.length; index++) {
      if (index == 4 || index == 8 || index == 12) {
        pie = pie + '</div><div class="row" style="margin-top:0px;">';
      }
      pie = pie + `<div class="col-md-${to}" ><p>${this.firmas[index].accion}<br> <h4> ${this.firmas[index].persona}</h4><br><h5>${this.firmas[index].cargo}</h5></p> </div>`;
    }
    pie = pie + '</div>';
    console.log(pie);
    moment.locale('es'); // 'en'
    console.log(this.mitabla);
    var o = [];
    for (var i = this.cabecera.length - 1; i >= 0; i--) {
      o.push(this.cabecera[i].field);
    }
    this.losprint = o;
    var ayy: any;
    ayy = new Tabulator('#example-table-tabulator', {
      rowFormatter: function (row) {
        console.log("LINEAS", row.getData())
        //row - row component

        var data = row.getData();

        if (data.col == "blue") {
          row.getElement().style.backgroundColor = "#A6A6DF";
        }
      },
      data: this.mitabla, //set initial table data

      printAsHtml: true,
      printCopyStyle: true,
      printVisibleRows: true,
      pagination: 'local',
      groupBy: this.categorizar ? 'categoria' : [],
      paginationSize: 50,
      paginationSizeSelector: [10, 50, 100, 200],
      movableColumns: true,
      printHeader: `<h1>Casa Grande Constructora</h1><h2>Proyecto: ${this.selectedItems1[0].itemName}</h2><h3>Desde: 
      ${moment(this.desde).format('MMMM Do YYYY')} 
      a ${moment(this.hasta).format('MMMM Do YYYY')}</h3><h4>(Expresado en Bolivianos)</h4> `,
      printFooter: pie,
      printConfig: {
        columnGroups: true, //do not include column groups in column headers for HTML table
        rowGroups: true, //do not include row groups in HTML table
        columnCalcs: true, //do not include column calcs in HTML table
      },
      columns: this.cabecera,
    });

    this.table_t = ayy;



    console.log('CALCULOS TOTALS', this.table_t.getCalcResults())
    $('#download-csv').click(function () {
      this.table_t.download('csv', 'data.csv');
    });

    //trigger download of data.json file
    $('#download-json').click(function () {
      this.table_t.download('json', 'data.json');
    });

    //trigger download of data.xlsx file
    $('#download-xlsx').click(function () {
      ayy.download('xlsx', 'data.xlsx', { sheetName: 'My Data' });
    });

    //trigger download of data.pdf file
    $('#download-pdf').click(function () {
      this.table_t.download('pdf', 'data.pdf', {
        orientation: 'landscape', //set page orientation to portrait
        title: 'Example Report', //add title to report
      });
    });

    $('#print-table').on('click', () => {
      /*  for (var ia = this.los.length - 1; ia >= 0; ia--) {
          this.los[ia]=JSON.parse(this.los[ia])
        }
        console.log(this.los)
        var x='<div class='row'>'
        for (var i = this.los.length - 1; i >= 0; i--) {
          x=x+'<div class='col-md-4'><p>'+this.los[i].nombre+'</p></div>'
        }
        x=x+'</div>'
        this.foo=x
        console.log(x)*/
      this.table_t.print();
    });
    // trigger download of data.html file





    /*   var events = $('#events');
      var codigo= $('#tablita23').DataTable( {
         select: true,
       lengthChange: true,
        dom: 'Bfrtip',
        buttons: [

           {extend:'copy',  
            text: 'Copiar',
            className: 'red',
            exportOptions: {
                   columns: ':visible'
               } 
            },

           {extend:'pdf',
            text: 'PDF',
            className: 'red',
            exportOptions: {
                   columns: ':visible'
               } 
            },
            {extend:'csv',
            text: 'CSV',
            className: 'orange',

            },
            {extend:'excel',
            text: 'Excel',
            className: 'green',
            exportOptions: {
                   columns: ':visible'
               } 
            },
            {extend:'print',
            text: 'Imprimir',
            className: 'icon',
            exportOptions: {
                   columns: ':visible'
               } 
            },
            {
              extend:'colvis',
              text: 'Ordenar',
              className: 'green'
            }
       ],
       responsive: true,
     data: this.mitabla,
     columns: [ 
         {data:'codigo'},
         {data:'bien'},
         { data: 'proyecto' },
         { data: 'horas' },
         { data: 'dias' },
         {data:'precio'},
         {data:'moneda'},
         {data:'costo'},
         {data:'cantidaddiesel'},
         {data:'preciodiesel'},
         {data:'monedadiesel'},
         {data:'totaldiesel'},   
         {data:'descuentorepuesto'},
         {data:'descuentomantenimiento'},
         {data:'descuentosueldos'},      
         {data:'descuentoropa'},
         {data:'totaldescuentos'},
         {data:'liquidopagable'},
         ]
       } );*/

  }
  eliminateDuplicates(arr) {
    var i,
      len = arr.length,
      out = [],
      obj = {};

    for (i = 0; i < len; i++) {
      obj[arr[i]] = 0;
    }
    for (i in obj) {
      out.push(i);
    }
    return out;
  }


  sedlb() {
    console.log(this.seleccionado)
    this.losnoprint.push(this.seleccionado[0])
    var index = this.losprint.indexOf(this.seleccionado[0]);
    if (index > -1) {
      this.losprint.splice(index, 1);
    }
    this.habilitar()
  }
  noprin() {
    this.losprint.push(this.seleccionado1[0])
    var index = this.losnoprint.indexOf(this.seleccionado1[0]);
    if (index > -1) {
      this.losnoprint.splice(index, 1);
    }
    this.habilitar()
  }
  habilitar() {
    //this.table_t.hideColumn('fecha')
    for (var i = this.losnoprint.length - 1; i >= 0; i--) {
      console.log(this.losnoprint[i])
      this.table_t.hideColumn(this.losnoprint[i])
    }
    for (var ie = this.losprint.length - 1; ie >= 0; ie--) {
      console.log(this.losprint[ie])
      this.table_t.showColumn(this.losprint[ie])
    }
  }

  firmar() {
    this.firmas.push({ persona: this.lafirma, cargo: this.elcargo, accion: this.laaccion });
    console.log(this.firmas);
  }


}
