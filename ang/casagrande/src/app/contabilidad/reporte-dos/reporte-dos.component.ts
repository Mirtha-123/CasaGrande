import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { PrincipalService } from '../../servicio/principal.service';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

declare var $: any;
declare var Tabulator: any;

@Component({
  selector: 'app-reporte-dos',
  templateUrl: './reporte-dos.component.html',
  styleUrls: ['./reporte-dos.component.css']
})
export class ReporteDosComponent implements OnInit {
  dropdownListAux = [];
  selectedItemsAux = [];
  dropdownSettingsAux = {};
  losGrupos: any = [];

  aux: any = false;
  grp: any = false;
  grp1: any = false;

  lanuevatabla: any;

  fechadesde = new Date();
  tipito: any;
  fechahasta = new Date();

  primero: any;
  segundo: any;
  miarbol1: any;
  miarbol2: any;
  lalistacuenta: any = [];
  todascuentas: any = [];

  tiposreporte: any = true;
  lanuevatabla15: any;
  losElegidos: any = ['categoria', 'cuenta', 'comprobante.numeroimportado', 'auxiliar', 'auxiliarAyuda', 'comprobante.fecha', 'glosa', 'comprobante.documento', 'debe', 'haber'];
  losNoElegidos: any = [];
  toppingList: any[] = [
    { value: 'categoria', name: 'CATEGORIA' },
    { value: 'cuenta', name: 'CUENTAS' },
    { value: 'comprobante.numeroimportado', name: 'NUMERO C.' },
    { value: 'auxiliar', name: 'C. AUXILIAR' },
    { value: 'auxiliarAyuda', name: 'N. AUXILIAR' },
    { value: 'comprobante.fecha', name: 'FECHA' },
    { value: 'glosa', name: 'GLOSA' },
    { value: 'comprobante.documento', name: 'DOCUMENTO' },
    { value: 'debe', name: 'DEBE' },
    { value: 'haber', name: 'HABER' },

  ];
  constructor(
    public api: PrincipalService
  ) {

  }

  ngOnInit() {
    this.obtener();

    this.dropdownSettingsAux = {
      singleSelection: true,
      text: "Selecciona Auxiliar",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      classes: "myclass custom-class"
    };


    this.api.AuxiliarListaGeneral().subscribe((respuestaAux) => {
      var pi = [];
      for (var i = respuestaAux.json().length - 1; i >= 0; i--) {
        var u = {
          id: respuestaAux.json()[i].codigo,
          itemName: respuestaAux.json()[i].codigo + " " + respuestaAux.json()[i].nombre
        }
        pi.push(u)
      }
      this.dropdownListAux = pi;
    })

  }

  onItemSelect(item: any) {
    console.log(item);
    console.log(this.selectedItemsAux);
  }
  OnItemDeSelect(item: any) {
    console.log(item);
    console.log(this.selectedItemsAux);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  onDeSelectAll(items: any) {
    console.log(items);
  }
  mostrarOcultar(v) {
    this.losElegidos = v;
    console.log(v);
    console.log(this.losElegidos);
    this.losNoElegidos = [];
    for (let index = 0; index < this.toppingList.length; index++) {
      var x = 0;
      for (let index1 = 0; index1 < v.length; index1++) {
        if (this.toppingList[index].value == v[index1]) {
          x = 1;
        }

      }
      if (x == 0) {
        this.losNoElegidos.push(this.toppingList[index].value)
      }

    }
    console.log(this.losElegidos, this.losNoElegidos)
    this.losElegidos.forEach(element => {
      this.lanuevatabla.showColumn(element);
    });

    this.losNoElegidos.forEach(element => {
      this.lanuevatabla.hideColumn(element);
    });
  }
  mostrarAgrupar(e) {
    console.log(e);
    this.losGrupos = e;
  }
  imprimir2(x) {
    console.log(x)
    switch (x) {
      case 1:
        this.lanuevatabla.print(false, true);
        break;
      case 2:
        this.lanuevatabla.download("csv", "data.csv");
        break;
      case 3:
        this.lanuevatabla.download("json", "data.json");
        break;
      case 4:
        this.lanuevatabla.download("xlsx", "data.xlsx", { sheetName: "My Data" });
        break;
      default:
        this.lanuevatabla.download("pdf", "data.pdf", {
          orientation: "portrait", //set page orientation to portrait
          title: "Example Report", //add title to report
        });
        break;
    }

  }
  obtener() {
    this.api.AuxiliarListaGeneral().subscribe((respuesta) => {
      console.log(respuesta.json());
    });
    this.api.lascuentitas().subscribe((data) => {
      this.lalistacuenta = data.json();
      console.log(this.lalistacuenta);
      let x = data.json();
      this.categorias();
      for (var i = x.length - 1; i >= 0; i--) {
        this.todascuentas.push({ id: x[i].numero, name: x[i].numero + ' ' + x[i].nombre });
      }



      var unaayuda = [];
      var dosayuda = data.json();
      for (var iz = dosayuda.length - 1; iz >= 0; iz--) {
        if (dosayuda[iz].papa == '' || dosayuda[iz].papa === undefined) {
          unaayuda.push({
            'id': dosayuda[iz].numero, ayuda: dosayuda[iz]._id,
            'parent': '#', 'text': dosayuda[iz].numero + ' ' + dosayuda[iz].nombre
          })
        } else {
          unaayuda.push({
            'id': dosayuda[iz].numero, ayuda: dosayuda[iz]._id,
            'parent': dosayuda[iz].papa, 'text': dosayuda[iz].numero + ' ' + dosayuda[iz].nombre
          });
        }

      }
      this.miarbol1 = unaayuda;
      $('#jstree_demo_div22').jstree({
        'core': {
          'data': this.miarbol1,

        },

        'checkbox': {
          'keep_selected_style': false,
          three_state: true, cascade: 'up'
        },
        'plugins': ['checkbox']
      });
    });
  }
  categorias() {
    this.api.categorias().subscribe((data) => {
      var w = data.json();
      var ota = []
      for (var i = w.length - 1; i >= 0; i--) {

        if (w[i].padre == '' || w[i].padre == undefined) {
          ota.push({ 'id': w[i].codigo, 'parent': '#', 'text': w[i].codigo + ' ' + w[i].nombre })
        } else {
          var u = 0
          for (var iq = w.length - 1; iq >= 0; iq--) {
            if (w[i].padre == w[iq].codigo) {
              u = 1
            }
          }
          if (u == 1) {
            ota.push({ 'id': w[i].codigo, 'parent': w[i].padre, 'text': w[i].codigo + ' ' + w[i].nombre })
          } else {

            ota.push({ 'id': w[i].codigo, 'parent': '#', 'text': w[i].codigo + ' ' + w[i].nombre })
          }
        }



        //  this.lacategoria.push({ id: w[i]._id, name: w[i].codigo + ' ' + w[i].nombre })
      }
      this.miarbol2 = ota;
      $('#jstree_demo_div33').jstree({
        'core': {
          'data': this.miarbol2,

        },

        'checkbox': {
          'keep_selected_style': false,
          three_state: true, cascade: 'up'
        },
        'plugins': ['checkbox']
      });
    });
  }

  seleccionotodo(x) {
    if (x == 1) {
      if (this.primero == true) {
        var instance1 = $('#jstree_demo_div22').jstree(true);
        var primerarbol = instance1._model.data
        $.each(primerarbol, function (key, value) {
          $('#jstree_demo_div22')
            .jstree('select_node', key);

        });
      } else {
        var instance1 = $('#jstree_demo_div22').jstree(true);
        var primerarbol = instance1._model.data
        $.each(primerarbol, function (key, value) {
          $('#jstree_demo_div22')
            .jstree('deselect_node', key);

        });
      }


    } else {
      if (this.segundo == true) {
        var instance1 = $('#jstree_demo_div33').jstree(true);
        var primerarbol = instance1._model.data
        $.each(primerarbol, function (key, value) {
          $('#jstree_demo_div33')
            .jstree('select_node', key);

        });
      } else {
        var instance1 = $('#jstree_demo_div33').jstree(true);
        var primerarbol = instance1._model.data
        $.each(primerarbol, function (key, value) {
          $('#jstree_demo_div33')
            .jstree('deselect_node', key);

        });
      }

    }



  }
  customFilter(data) {
    return data.car && data.rating < 3;
  }
  limpieza() {
    $("#filter-field").val("");
    $("#filter-type").val("=");
    $("#filter-value").val("");

    this.lanuevatabla.clearFilter();
  }
  //Trigger setFilter function with correct parameters
  updateFilter() {

    var filter = $("#filter-field").val() == "function" ? this.customFilter : $("#filter-field").val();

    if ($("#filter-field").val() == "function") {
      $("#filter-type").prop("disabled", true);
      $("#filter-value").prop("disabled", true);
    } else {
      $("#filter-type").prop("disabled", false);
      $("#filter-value").prop("disabled", false);
    }

    this.lanuevatabla.setFilter(filter, $("#filter-type").val(), $("#filter-value").val());
  }
  cambiarVisibilidad(x) {
    console.log(this.aux);
    if (this.aux) {
      this.lanuevatabla.showColumn('auxiliar');
    } else {
      this.lanuevatabla.hideColumn('auxiliar');
    }

  }
  cambiarGrupos(x) {
    console.log(this.grp);
    if (this.grp && this.grp1) {
      this.lanuevatabla.setGroupBy(['categoria', 'nombrecuenta']);
    } else {
      if (this.grp) {
        this.lanuevatabla.setGroupBy('categoria');
      } else {
        this.lanuevatabla.setGroupBy([]);
      }
    }


  }
  cambiarGrupos1(x) {
    console.log(this.grp);
    if (this.grp && this.grp1) {
      this.lanuevatabla.setGroupBy(['nombrecuenta', 'categoria']);
    } else {
      if (this.grp1) {
        this.lanuevatabla.setGroupBy('nombrecuenta');
      } else {
        this.lanuevatabla.setGroupBy([]);
      }
    }


  }

  reporte() {

    var instance1 = $('#jstree_demo_div22').jstree(true);
    var primerarbol = instance1._model.data

    var instance2 = $('#jstree_demo_div33').jstree(true);
    var segundoarbol = instance2._model.data



    var cuentas = this.primero
    var autos = this.segundo
    var x = {
      cuentas: [],
      autos: [],
      desde: this.fechadesde,
      hasta: this.fechahasta,
      tipo: this.tipito,
      aux: this.selectedItemsAux
    }



    $.each(primerarbol, function (key, value) {

      if (value.state.selected == true) {
        x.cuentas.push(key)
      }
    });
    $.each(segundoarbol, function (key, value) {

      if (value.state.selected == true) {
        x.autos.push(key)
      }
    });
    console.log(x)
    /*for (var i = cuentas.length - 1; i >= 0; i--) {
       x.cuentas.push(cuentas[i].id)
     }
     for (var i = autos.length - 1; i >= 0; i--) {
       x.autos.push(autos[i].id)
     }*/
    let debeAora: any = 0;
    let haberAora: any = 0;
    let saldoAora: any = 0;

    this.api.AuxiliarListaGeneral().subscribe((respuesta) => {
      var auxiliares = respuesta.json();
      this.api.buscarotrocomprobante2(x).subscribe((data) => {
        console.log(data.json());

        var atras = data.json().atras;
        let debeA: any = 0;
        let haberA: any = 0;
        for (let indexx = 0; indexx < atras.length; indexx++) {
          debeA = parseFloat(debeA) + parseFloat(atras[indexx].debe);
          debeA = parseFloat(debeA) + parseFloat(atras[indexx].debe);
        }
        let saldoA: any = parseFloat(debeA) - parseFloat(haberA);
        console.log(debeA, haberA, saldoA);

        let clondebea = parseFloat(debeA).toFixed(2);
        let clonhabera = parseFloat(haberA).toFixed(2);
        let clonsaldoa = parseFloat(saldoA).toFixed(2);

        var datos: any = data.json().de
        var cuentas = data.json().cuentas
        for (var i = 0; i <= datos.length - 1; i++) {



          saldoA = parseFloat(saldoA) + parseFloat(datos[i].debe);
          saldoA = parseFloat(saldoA) - parseFloat(datos[i].haber);
          datos[i].saldo = parseFloat(saldoA).toFixed(2);


          debeAora = parseFloat(debeAora) + parseFloat(datos[i].debe);
          haberAora = parseFloat(haberAora) + parseFloat(datos[i].haber);
          saldoAora = parseFloat(saldoAora) + parseFloat(datos[i].saldo);


          if (datos[i].auxiliar != '') {
            for (let index1 = 0; index1 < auxiliares.length; index1++) {
              if (auxiliares[index1].codigo == datos[i].auxiliar) {
                datos[i].auxiliarAyuda = auxiliares[index1].nombre;
                break;
              }

            }
          } else {
            datos[i].auxiliarAyuda = '';
          }

          $.each(datos[i], (index, value) => {
            if (index == 'categoria') {
              datos[i].categoria = datos[i].categoria.nombre
            }
            for (var iq = cuentas.length - 1; iq >= 0; iq--) {
              if (datos[i].cuenta == cuentas[iq].numero) {
                datos[i].nombrecuenta = cuentas[iq].nombre
              }
            }
          });

        }
        console.log(datos)
        this.lanuevatabla = new Tabulator("#tablaReporte", {
          data: datos, //set initial table data,
          groupClosedShowCalcs: true,
          groupHeader: [
            function (value, count, data) { //generate header contents for gender groups
              return value + "<span style='color:#d00; margin-left:10px;'>(" + count + " Comprobantes)</span>";
            },
            function (value, count, data) {
              //generate header contents for color groups
              return value + "<span style='color:#0dd; margin-left:10px;'>(" + count + " Detalle)</span>";
            },
          ],
          layout: "fitColumns",
          printAsHtml: true,
          pagination: "local",
          paginationSize: 50,
          printHeader: `<img src="./assets/log.jpg" style="width:150px;float:left;"></img> <h1>Libro Mayor</h1><h3>Desde: 
          ${moment(this.fechadesde).format('MMMM Do YYYY')} 
          a ${moment(this.fechahasta).format('MMMM Do YYYY')}</h3>`,
          paginationSizeSelector: [10, 50, 100, 200],
          movableColumns: true,
          printConfig: {
            columnGroups: true, //do not include column groups in column headers for HTML table
            rowGroups: true, //do not include row groups in HTML table
            columnCalcs: true, //do not include column calcs in HTML table
          },
          columns: [
            {
              title: "Tipo", field: "comprobante.documento", width: 20, formatter: (cell, formatterParams) => {
                var value = cell.getValue();
                switch (value) {
                  case 'ingreso':
                    return 1
                    break;
                  case 'egreso':
                    return 2
                    break;
                  case 'traspaso':
                    return 3
                    break;
                  case 'apertura':
                    return 4
                    break;
                  default:
                    break;
                }

              }
            },
            { title: "Cuenta", field: "cuenta" },
            { title: "Cbte", field: "comprobante.numeroimportado" },
            { title: "Fecha", field: "comprobante.fecha" },
            { title: "Glosa", field: "glosa", width: 200, height: 100, formatter: "textarea", },
            { title: "Cheque", field: "cheque" },
            { title: "Debe", field: "debe", bottomCalc: "sum" },
            { title: "Haber", field: "haber", bottomCalc: "sum" },
            { title: "Saldo", field: "saldo", bottomCalc: "sum" },
            { title: "Auxiliar", field: "auxiliar", visible: false },
            { title: "Auxiliar", field: "auxiliarAyuda", visible: true },





          ],
        });

        this.lanuevatabla.addData([{ "glosa": "Saldos", debe: clondebea, haber: clonhabera, saldo: clonsaldoa }], true);
        this.lanuevatabla.addData([{ "glosa": "Suma del Periodo:", debe: debeAora, haber: haberAora, saldo: (parseFloat(debeAora) - parseFloat(haberAora)).toFixed(2) }], false);
        this.lanuevatabla.addData([{ "glosa": "Suma y Saldos finales:", debe: parseFloat(clondebea) + parseFloat(debeAora), haber: parseFloat(clonhabera) + parseFloat(haberAora), saldo: (parseFloat(clondebea) + parseFloat(debeAora)) - (parseFloat(clonhabera) + parseFloat(haberAora)) }], false);


        var results = this.lanuevatabla.getCalcResults();
        console.log(results)
        console.log(typeof results)
        var todito: any = 0
        var todito1: any = 0
        for (const prop in results) {
          for (const and in results[prop]) {
            for (const grop in results[prop][and]) {
              for (const sacar in results[prop][and][grop]) {
                for (const el in results[prop][and][grop][sacar]) {

                  if (el == 'debe') {
                    todito = parseFloat(todito) + parseFloat(results[prop][and][grop][sacar][el])
                  } else if (el == 'haber') {
                    todito1 = parseFloat(todito1) + parseFloat(results[prop][and][grop][sacar][el])
                  }

                }

                //todito=todito+parseFloat(results[prop][and][grop][sacar])
              }
            }
          }

        }


      });
    });



  }


}
