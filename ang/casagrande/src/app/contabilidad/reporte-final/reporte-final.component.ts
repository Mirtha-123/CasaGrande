import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { PrincipalService } from '../../servicio/principal.service';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DatePipe } from '@angular/common';

declare var $: any;
declare var Tabulator: any;

@Component({
  selector: 'app-reporte-final',
  templateUrl: './reporte-final.component.html',
  styleUrls: ['./reporte-final.component.css'],
  providers: [DatePipe]
})
export class ReporteFinalComponent implements OnInit {
  elDeb: any = 0;
  elHab: any = 0;
  elnumeroMagico: any = 0;
  grp: any = false;
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

  constructor(
    public api: PrincipalService,
    private datePipe: DatePipe,
  ) {

  }

  ngOnInit() {
    this.obtener();
  }
  imprimir2(x) {
    console.log(x)
    switch (x) {
      case 1:
        this.lanuevatabla15.print(false, true);
        break;
      case 2:
        this.lanuevatabla15.download("csv", "data.csv");
        break;
      case 3:
        this.lanuevatabla15.download("json", "data.json");
        break;
      case 4:
        this.lanuevatabla15.download("xlsx", "data.xlsx", { sheetName: "My Data" });
        break;
      default:
        this.lanuevatabla15.download("pdf", "data.pdf", {
          orientation: "portrait", //set page orientation to portrait
          title: "Example Report", //add title to report
        });
        break;
    }

  }
  obtener() {
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





  reporte() {


    const instance1 = $('#jstree_demo_div22').jstree(true);
    const primerarbol = instance1._model.data;

    const instance2 = $('#jstree_demo_div33').jstree(true);
    const segundoarbol = instance2._model.data;
    const padres = [];


    const x = {
      cuentas: [],
      autos: [],
      desde: this.datePipe.transform(this.fechadesde, 'yyyy-MM-dd'),
      hasta: this.datePipe.transform(this.fechahasta, 'yyyy-MM-dd'),
      tipo: this.tipito
    };

    console.log(x);

    $.each(primerarbol, function (key, value) {

      if (value.state.selected === true) {
        x.cuentas.push(key);
      }
    });
    $.each(segundoarbol, function (key, value) {

      if (value.state.selected === true) {
        x.autos.push(key);
      }
    });

    console.log(x);
    /*for (var i = cuentas.length - 1; i >= 0; i--) {
       x.cuentas.push(cuentas[i].id)
     }
     for (var i = autos.length - 1; i >= 0; i--) {
       x.autos.push(autos[i].id)
     }*/

    this.api.AuxiliarListaGeneral().subscribe((respuesta) => {
      var auxiliares = respuesta.json();
      this.api.buscarotrocomprobante1(x).subscribe((data) => {
        console.log(data.json());
        const datitos = [];
        var datos: any = data.json().de;
        var cuentas = data.json().cuentas;

        var menu = []

        for (var i = datos.length - 1; i >= 0; i--) {
          for (var ie = this.lalistacuenta.length - 1; ie >= 0; ie--) {
            if (datos[i].cuenta == this.lalistacuenta[ie].numero) {

              this.buscarPadres(this.lalistacuenta[ie].papa, menu);
              datitos.push({ cuenta: datos[i].cuenta, nombre: this.lalistacuenta[ie].nombre, papa: this.lalistacuenta[ie].papa })
            }
          }

        }
        console.log('PADRES', menu);
        console.log(datitos);
        var ooo = menu.filter((valor, indiceActual, arreglo) => arreglo.indexOf(valor) === indiceActual);


        const valoresUnico = this.eliminarObjetosDuplicados(datitos, 'cuenta');
        console.log(padres);
        const totalC = [];
        let valorUnico: any = 0;
        let dameDebe: any = 0;
        let dameHaber: any = 0;

        for (var ia = valoresUnico.length - 1; ia >= 0; ia--) {
          var r: any = {
            cuenta: valoresUnico[ia].cuenta,
            nombre: valoresUnico[ia].nombre,
            papa: valoresUnico[ia].papa,
            debe: 0,
            haber: 0,

          }
          for (var ib = datos.length - 1; ib >= 0; ib--) {
            if (datos[ib].cuenta == valoresUnico[ia].cuenta) {
              r.debe = parseFloat(r.debe) + parseFloat(datos[ib].debe)
              r.haber = parseFloat(r.haber) + parseFloat(datos[ib].haber)
              if (datos[ib].categoria) {
                r.categoria = datos[ib].categoria.nombre;
                r.categoriaCodigo = datos[ib].categoria.codigo;
              }

            }
          }
          r.total = parseFloat(r.debe) - parseFloat(r.haber);
          dameDebe = parseFloat(dameDebe) + parseFloat(r.debe);
          dameHaber = parseFloat(dameHaber) + parseFloat(r.haber);
          valorUnico = parseFloat(valorUnico) + parseFloat(r.total);
          totalC.push(r);
        }
        this.elnumeroMagico = valorUnico.toFixed(2);
        this.elDeb = dameDebe.toFixed(2);
        this.elHab = dameHaber.toFixed(2);
        const unamas = [];
        console.log(ooo);
        for (var id = ooo.length - 1; id >= 0; id--) {
          var ss: any = {
            cuenta: ooo[id],
            nombre: "",
            papa: "",
            classe: 'father'
          }
          for (var irr = this.lalistacuenta.length - 1; irr >= 0; irr--) {
            if (ooo[id] == this.lalistacuenta[irr].numero) {

              ss.nombre = this.lalistacuenta[irr].nombre;
              ss.papa = this.lalistacuenta[irr].papa;
            }
          }

          unamas.push(ss);
        }
        console.log(unamas);
        console.log(totalC);
        const finis: any = [];






        unamas.sort(function (a, b) {
          return (a.cuenta - b.cuenta);
        });
        console.log(unamas);

        for (var iwxw = unamas.length - 1; iwxw >= 0; iwxw--) {

          var qq: any = {
            cuenta: unamas[iwxw].cuenta,
            nombre: unamas[iwxw].nombre,
            papa: unamas[iwxw].papa,
            classe: unamas[iwxw].classe,
            total: 0,
            class: 'negro'
          }
          var mischamacos = []
          for (var izz = this.lalistacuenta.length - 1; izz >= 0; izz--) {
            if (this.lalistacuenta[izz].papa == unamas[iwxw].cuenta) {
              mischamacos.push(this.lalistacuenta[izz].numero);
            }
          }

          for (var ihh = mischamacos.length - 1; ihh >= 0; ihh--) {
            for (var iuu = totalC.length - 1; iuu >= 0; iuu--) {
              if (totalC[iuu].cuenta == mischamacos[ihh]) {

                qq.total = parseFloat(qq.total) + parseFloat(totalC[iuu].total);
              }
            }
          }




          finis.push(qq);
        }

        let opcional: any = {};
        opcional = finis;

        finis.sort(function (a, b) {
          return (a.cuenta - b.cuenta)
        })
        for (var pp = finis.length - 1; pp >= 0; pp--) {
          var mihijo = []
          let contaduria: any = []
          for (var izt = this.lalistacuenta.length - 1; izt >= 0; izt--) {
            if (this.lalistacuenta[izt].papa == finis[pp].cuenta) {
              mihijo.push(this.lalistacuenta[izt].numero)
              contaduria.push(this.lalistacuenta[izt])
            }
          }
          for (var ize = mihijo.length - 1; ize >= 0; ize--) {
            for (var isa = finis.length - 1; isa >= 0; isa--) {
              if (mihijo[ize] == finis[isa].cuenta) {
                finis[pp].total = parseFloat(finis[pp].total) + finis[isa].total;
              }
            }

          }

        }

        for (var lo = totalC.length - 1; lo >= 0; lo--) {
          var t: any = {
            cuenta: totalC[lo].cuenta,
            nombre: totalC[lo].nombre,
            papa: totalC[lo].papa,
            total: totalC[lo].total,
            categoria: totalC[lo].categoria,
            categoriaCodigo: totalC[lo].categoriaCodigo
          }
          finis.push(t);
        }

        for (var ip = finis.length - 1; ip >= 0; ip--) {
          if (parseFloat(finis[ip].total) == 0) {
            finis.splice(ip, 1)
          }
        }

        finis.sort(function (a, b) {
          return (a.cuenta - b.cuenta);
        });

        console.log(finis);
        this.lanuevatabla15 = new Tabulator("#tablaReporte", {
          dataTree: true,

          data: finis, //set initial table data
          layout: "fitColumns",
          printAsHtml: true,
          printCopyStyle: true,
          dataTreeStartExpanded: true,
          dataTreeCollapseElement: "<i class='fas fa-minus-square'></i>",
          dataTreeBranchElement: true,
          pagination: "local",
          paginationSize: 50,
          rowFormatter: function (row) {
            if (row.getData().class == "negro") {
              // row.getElement().style.backgroundColor = "#A6A6DF";
            }

          },

          paginationSizeSelector: [10, 50, 100, 200],
          movableColumns: true,
          printHeader: `<div class="row"><div class="col-md-3"><img src="./assets/log.jpg" style="width:150px;"></img></div> 
          <div class="col-md-5"><h2>Estado de Resultado</h2></div>
          <div class="col-md-4"></div>
          </div>
          <h3>Desde: 
          ${moment(this.fechadesde).format('MMMM Do YYYY')} 
          a ${moment(this.fechahasta).format('MMMM Do YYYY')}</h3>
         <h4>(Expresado en Bolivianos)</h4> 
         <p><b>Total:</b>${this.elnumeroMagico}<br>
         <b>Debe:</b>${this.elDeb}<br>
         <b>Haber:</b>${this.elHab}<br>
         </p>

          
          
          `,
          printConfig: {
            columnGroups: true, //do not include column groups in column headers for HTML table
            rowGroups: true, //do not include row groups in HTML table
            columnCalcs: true, //do not include column calcs in HTML table
          },
          columns: [
            {
              title: "Cuenta", field: "cuenta", sorter: 'cuenta', formatter: (cell, formatterParams) => {
                var value = cell.getValue();
                for (let index = 0; index < finis.length; index++) {
                  if (finis[index].cuenta == value) {
                    if (finis[index].classe == 'father') {
                      return '<span style="color: red; font - weight: bold; ">' + value + '</span>';
                    } else {
                      return value;
                    }
                  }
                }

              }
            },
            { title: "Nombre Cuenta", field: "nombre" },

            {
              title: "Total", field: "total", formatter: "money", formatterParams: {
                decimal: ",",
                thousand: ".",
                symbol: "Bs",
                symbolAfter: "Bs",
                precision: 2,
              }
            },
          ],
        });
      });
    });


  }

  buscarPadres(j, menu) {
    /*for (let index = 0; index < this.lalistacuenta.length; index++) {
      if (this.lalistacuenta[index].numero == j) {
        menu.push(this.lalistacuenta[index].numero);
        if (this.lalistacuenta[index].papa) {
          this.buscarPadres(this.lalistacuenta[index].papa, menu);
        }
      }

    }
    return menu;*/
    for (let index = 0; index < this.lalistacuenta.length; index++) {
      if (this.lalistacuenta[index].numero == j) {
        menu.push(this.lalistacuenta[index].numero);

      }

    }
    return menu;
  }


  eliminarObjetosDuplicados(arr, prop) {
    var nuevoArray = [];
    var lookup = {};

    for (var i in arr) {
      lookup[arr[i][prop]] = arr[i];
    }

    for (i in lookup) {
      nuevoArray.push(lookup[i]);
    }

    return nuevoArray;
  }
  cambiarGrupos(x) {
    console.log(this.grp);
    if (this.grp) {
      this.lanuevatabla15.setGroupBy('categoria');
    } else {
      this.lanuevatabla15.setGroupBy([]);
    }

  }
}
