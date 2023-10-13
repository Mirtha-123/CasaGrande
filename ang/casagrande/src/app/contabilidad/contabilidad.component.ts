import { Component, OnInit, ViewChild } from '@angular/core';
import { PrincipalService } from '../servicio/principal.service'
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { ReporteUnoComponent } from './reporte-uno/reporte-uno.component';
import { MatDialog } from '@angular/material';

declare var $: any
declare var dhx: any
declare var jexcel: any
declare var swal: any
declare var Tabulator: any
declare var XLSX: any
@Component({
  selector: 'app-contabilidad',
  templateUrl: './contabilidad.component.html',
  styleUrls: ['./contabilidad.component.css']
})
export class ContabilidadComponent implements OnInit {

  dropdownListAux = [];
  selectedItemsAux = [];
  dropdownSettingsAux = {};

  general = []
  generalAyuda: any = [];
  losGrupos: any = [];


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
  eluno1: any = 0
  eldos1: any = 0
  eltotal2: any = 0
  lanuevatabla15: any
  lanuevatabla16: any
  elcuatro1: any = 0
  elcinco1: any = 0
  eltotal: any = 0
  itemsbienes11: any = []
  estadoproy: any
  debe: any = 0
  haber: any = 0



  primero: any
  segundo: any


  tiposreporte: boolean = true
  miarbol1: any
  miarbol2: any
  miarbolito: any
  reporteporbuscar: boolean = true
  cuentanumerito: any = 0
  bucador: any = ""
  jsona: any


  paso1: boolean = true
  paso2: boolean = false
  paso3: boolean = false



  archivo: Array<File>

  tipoDeImporte: any;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  displayedColumns: string[] = ['_id', 'nombre', 'numero', 'acciones'];
  principal: any = []









  tipocuenta: any






  tamanotabla: any = [100, 100, 100, 100, 100, 200, 100, 100, 100, 100, 100, 100, 100, 100, 100]
  latabla: any
  public dd: any = []
  data = [
    ['Mazda', 2001, 2000],
    ['Pegeout', 2010, 5000],
    ['Honda Fit', 2009, 3000],
    ['Honda CRV', 2010, 6000],
  ];


  comprobantenumero: number = 0
  elcomprobante: any = {
    entidad: "",
    proyecto: "",
    documento: ""
  }
  proyect: any = []
  contador = 1
  fechaactual = new Date()

  selected = new FormControl(0);
  loscomprobante: any
  maximo: number = 0

  latablita: any
  funcion: any

  servidor: any
  buscador: any
  buscador1: any

  posiblescomprobantes: any = []
  posiblescuentas: any = []

  cuentascontables: boolean = false
  loscomprobantes: boolean = false
  tablaabierta: boolean = false
  tablaabierta1: boolean = false
  papa: boolean = false

  cuenta: any = {}
  todascuentas: any = []
  lalistacuenta: any = []
  lacategoria: any = []
  lacelda: any


  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  dropdownList1 = [];
  selectedItems1 = [];
  dropdownSettings1 = {};
  dropdownList2 = [];
  selectedItems2 = [];
  dropdownSettings2 = {};

  fechadesde = new Date()
  fechahasta = new Date()
  fechadesde1 = new Date()
  fechahasta1 = new Date()
  fechadesde2 = new Date()
  fechahasta2 = new Date()
  fechahasta3 = new Date()
  lanuevatabla: any
  lanuevatabla1: any
  num: any = []
  aux: any = {}



  todasauxiliares: any = []
  elresto: any = []
  papichau: boolean = true


  tipito: any
  constructor(
    public api: PrincipalService,
    private router: Router,
    public dialog: MatDialog
  ) { }
  dropdownList11 = [];
  selectedItems11 = [];
  selectedItemsproy = [];
  selectedItemsproy1 = [];
  dropdownSettings11 = {};
  itemspro: any = []
  mitabla: any = []
  miarchivo: any = {}
  losElegidos: any = ['categoria', 'cuenta', 'comprobante.numeroimportado', 'auxiliar', 'auxiliarAyuda', 'comprobante.fecha', 'glosa', 'comprobante.documento', 'debe', 'haber'];
  losNoElegidos: any = [];
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
      this.lanuevatabla.showColumn(element)
    });

    this.losNoElegidos.forEach(element => {
      this.lanuevatabla.hideColumn(element)
    });
  }
  mostrarAgrupar(e) {
    console.log(e);
    this.losGrupos = e;
  }
  onItemSelect11(item: any) {
    console.log(item);
    console.log(this.selectedItems1);
  }
  OnItemDeSelect11(item: any) {
    console.log(item);
    console.log(this.selectedItems1);
  }
  onSelectAll11(items: any) {
    console.log(items);
  }
  onDeSelectAll11(items: any) {
    console.log(items);
  }
  denuevo() {
    this.reporteporbuscar = true
    this.tablaabierta1 = false
  }

  fechascargar() {

    this.api.cargarfechas({ mensaje: this.jsona, tipo: this.tipoDeImporte }).subscribe((data) => {
      console.log(data.json())
      this.paso1 = false
      this.paso2 = false
      this.paso3 = true
    })
  }
  bucando() {
    if (this.bucador == "") {
      this.api.cuentaslista(this.cuentanumerito).subscribe((data) => {

        var oto = data.json()
        this.principal = new MatTableDataSource(oto);
        this.principal.paginator = this.paginator;
        this.principal.sort = this.sort;
      })
    } else {

      var i: any = {
        mensaje: this.bucador
      }
      this.api.filtrarcuenta(i).subscribe((data) => {
        var oto = data.json()
        this.principal = new MatTableDataSource(oto);
        this.principal.paginator = this.paginator;
        this.principal.sort = this.sort;
      })
    }

  }
  jugar(x) {

    if (x == 0) {
      this.cuentanumerito = this.cuentanumerito - 100
    } else {
      this.cuentanumerito = this.cuentanumerito + 100
    }
    if (this.cuentanumerito >= 0) {

      this.api.cuentaslista(this.cuentanumerito).subscribe((data) => {

        var oto = data.json()
        this.principal = new MatTableDataSource(oto);
        this.principal.paginator = this.paginator;
        this.principal.sort = this.sort;
      })
    } else {
      this.cuentanumerito = 0
      this.api.cuentaslista(this.cuentanumerito).subscribe((data) => {

        var oto = data.json()
        this.principal = new MatTableDataSource(oto);
        this.principal.paginator = this.paginator;
        this.principal.sort = this.sort;
      })
    }

  }
  verrr() {
    this.api.llamamiento().subscribe((data) => {
      console.log(data.json())
    })
  }
  sinpapi() {
    console.log(this.papa)
    if (this.papa == true) {
      this.papichau = false
      this.cuenta = {}
    } else {
      this.papichau = true
    }
  }
  revisar() {
    console.log(this.tipito);
  }
  bucandoq() {
    console.log(this.tipito)

    var losum = []

    var data = []
    var x: any = {
      proy: this.selectedItemsproy,
      desde: this.fechadesde2,
      hasta: this.fechahasta2,
      tipo: this.tipito
    }

    for (var i = this.miarbolito.length - 1; i >= 0; i--) {
      var y = this.miarbolito[i].id.substr(0, 1)

      if (y == '4' || y == '5') {
        losum.push(this.miarbolito[i].parent)
        data.push(this.miarbolito[i].id)
      }
    }


    var ooo = losum.filter(function (elem, pos) {
      return losum.indexOf(elem) == pos;
    });
    x.data = data
    this.api.reporte2(x).subscribe((data) => {
      var unamas: any = []
      var ayuda = data.json()
      var ayudita = []
      var masayudita = []
      var valoresUnico: any = []
      var valoresUnico2: any = []
      console.log(data.json())
      for (var i = ayuda.length - 1; i >= 0; i--) {
        for (var ie = this.lalistacuenta.length - 1; ie >= 0; ie--) {
          if (ayuda[i].cuenta == this.lalistacuenta[ie].numero) {
            ayudita.push({ cuenta: ayuda[i].cuenta, nombre: this.lalistacuenta[ie].nombre, papa: this.lalistacuenta[ie].papa })
          }
        }

      }

      valoresUnico = this.eliminarObjetosDuplicados(ayudita, 'cuenta')
      console.log(valoresUnico)
      for (var ia = valoresUnico.length - 1; ia >= 0; ia--) {
        var r: any = {
          cuenta: valoresUnico[ia].cuenta,
          nombre: valoresUnico[ia].nombre,
          papa: valoresUnico[ia].papa,
          debe: 0,
          haber: 0,

        }
        for (var ib = ayuda.length - 1; ib >= 0; ib--) {
          if (ayuda[ib].cuenta == valoresUnico[ia].cuenta) {
            r.debe = parseFloat(r.debe) + parseFloat(ayuda[ib].debe)
            r.haber = parseFloat(r.haber) + parseFloat(ayuda[ib].haber)

          }
        }
        r.total = parseFloat(r.debe) - parseFloat(r.haber)
        masayudita.push(r)
      }
      console.log(ooo)
      for (var id = ooo.length - 1; id >= 0; id--) {
        var ss: any = {
          cuenta: ooo[id],
          nombre: "",
          papa: ""

        }
        for (var irr = this.lalistacuenta.length - 1; irr >= 0; irr--) {
          if (ooo[id] == this.lalistacuenta[irr].numero) {
            ss.nombre = this.lalistacuenta[irr].nombre
            ss.papa = this.lalistacuenta[irr].papa
          }
        }

        unamas.push(ss)
      }
      var finis: any = []






      unamas.sort(function (a, b) {
        return (a.cuenta - b.cuenta)
      })
      console.log(unamas);
      for (var iwxw = unamas.length - 1; iwxw >= 0; iwxw--) {

        var qq: any = {
          cuenta: unamas[iwxw].cuenta,
          nombre: unamas[iwxw].nombre,
          papa: unamas[iwxw].papa,
          total: 0,
          class: "negro"
        }
        var mischamacos = []
        for (var izz = this.lalistacuenta.length - 1; izz >= 0; izz--) {
          if (this.lalistacuenta[izz].papa == unamas[iwxw].cuenta) {
            mischamacos.push(this.lalistacuenta[izz].numero)
          }
        }

        for (var ihh = mischamacos.length - 1; ihh >= 0; ihh--) {
          for (var iuu = masayudita.length - 1; iuu >= 0; iuu--) {
            if (masayudita[iuu].cuenta == mischamacos[ihh]) {

              qq.total = parseFloat(qq.total) + parseFloat(masayudita[iuu].total)
            }
          }
        }




        finis.push(qq)
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
              finis[pp].total = parseFloat(finis[pp].total) + finis[isa].total
            }
          }

        }

      }

      console.log(masayudita)

      for (var lo = masayudita.length - 1; lo >= 0; lo--) {
        var t: any = {
          cuenta: masayudita[lo].cuenta,
          nombre: masayudita[lo].nombre,
          papa: masayudita[lo].papa,
          total: masayudita[lo].total
        }
        finis.push(t)
      }
      var elcinco = 0
      var elcuatro = 0

      for (var ipp = finis.length - 1; ipp >= 0; ipp--) {
        if (finis[ipp].cuenta == '5000000') {
          elcinco = parseFloat(finis[ipp].total)
        }
        if (finis[ipp].cuenta == '4000000') {
          elcuatro = parseFloat(finis[ipp].total)
        }
      }
      this.elcinco1 = elcinco.toFixed(2);
      this.elcuatro1 = elcuatro.toFixed(2);
      this.eltotal = (parseFloat(this.elcinco1) - parseFloat(this.elcuatro1)).toFixed(2);
      for (var ip = finis.length - 1; ip >= 0; ip--) {
        if (parseFloat(finis[ip].total) == 0) {
          finis.splice(ip, 1)
        }
      }



      finis.sort(function (a, b) {
        return (a.cuenta - b.cuenta)
      })
      console.log(finis)

      this.generalAyuda = finis;
      let popular1 = []

      let menus = this.ordenar(finis);
      console.log(menus.menu);


      this.lanuevatabla15 = new Tabulator("#otratabla1", {
        dataTree: true,

        data: menus.menu, //set initial table data
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
            row.getElement().style.backgroundColor = "#A6A6DF";
          }
        },
        paginationSizeSelector: [10, 50, 100, 200],
        movableColumns: true,
        printHeader: `<img src="./assets/log.jpg" style="width:150px;"></img> <h1>Estado de Resultado</h1><h3>Resultado ${this.eltotal}</h3>`,
        printConfig: {
          columnGroups: true, //do not include column groups in column headers for HTML table
          rowGroups: true, //do not include row groups in HTML table
          columnCalcs: true, //do not include column calcs in HTML table
        },
        columns: [
          { title: "Categoria", field: "cuenta", sorter: 'cuenta' },
          { title: "Cuenta", field: "nombre" },

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

















    })


  }

  agregarAlDocumentos(dato, ejercicio: any, nivel: any, todo: Array<any>, valor, papi) {
    for (let index = 0; index < this.lalistacuenta.length; index++) {
      if (dato == this.lalistacuenta[index].papa) {
        nivel.push(this.lalistacuenta[index])
        this.agregarAlDocumentos(this.lalistacuenta[index].numero, ejercicio, [], todo, valor++, this.lalistacuenta[index].papa)
      }
    }
    var y = {
      datos: dato,
      papi: papi,
      _children: []
    }
    y._children = nivel
    if (y.papi != '#') {
      todo.find

    }
    todo.push(y);
    // [{hijo: [hijo]},{hijo},{hijo}]




    return todo
  }

  ordenar(j) {
    let menu = { menu: [] };

    for (let n in j) {
      this.insertar(j[n], 0, menu.menu);
    }
    return menu;
  }

  insertar(j, l, menu) {
    for (let n in menu) {
      if (menu[n].cuenta == j.papa) {
        if (menu[n]._children == undefined)
          menu[n]._children = [];
        return menu[n]._children.push(j);
      } else {
        if (menu[n]._children)
          if (this.insertar(j, l + 1, menu[n]._children))
            return true;
      }
    }
    if (l)
      return false;

    menu.push(j);
  }


  bucandoq1() {
    var data: any = []
    var losum: any = []
    var x: any = {
      proy: this.selectedItemsproy1,
      hasta: this.fechahasta3
    }

    for (var i = this.miarbolito.length - 1; i >= 0; i--) {
      var y = this.miarbolito[i].id.substr(0, 1)

      if (y == '1' || y == '2') {
        losum.push(this.miarbolito[i].parent)
        data.push(this.miarbolito[i].id)
      }
    }

    var ooo = losum.filter(function (elem, pos) {
      return losum.indexOf(elem) == pos;
    });
    x.data = data
    this.api.reportebalance(x).subscribe((data) => {
      console.log(data.json())
      var unamas: any = []
      var ayuda = data.json()
      var ayudita = []
      var masayudita = []
      var valoresUnico: any = []
      var valoresUnico2: any = []
      console.log(data.json())
      for (var i = ayuda.length - 1; i >= 0; i--) {
        for (var ie = this.lalistacuenta.length - 1; ie >= 0; ie--) {
          if (ayuda[i].cuenta == this.lalistacuenta[ie].numero) {
            ayudita.push({ cuenta: ayuda[i].cuenta, nombre: this.lalistacuenta[ie].nombre })
          }
        }

      }


      valoresUnico = this.eliminarObjetosDuplicados(ayudita, 'cuenta')

      for (var ia = valoresUnico.length - 1; ia >= 0; ia--) {
        var r: any = {
          cuenta: valoresUnico[ia].cuenta,
          nombre: valoresUnico[ia].nombre,
          debe: 0,
          haber: 0,

        }
        for (var ib = ayuda.length - 1; ib >= 0; ib--) {
          if (ayuda[ib].cuenta == valoresUnico[ia].cuenta) {
            r.debe = parseFloat(r.debe) + parseFloat(ayuda[ib].debe)
            r.haber = parseFloat(r.haber) + parseFloat(ayuda[ib].haber)

          }
        }
        r.total = parseFloat(r.debe) - parseFloat(r.haber)
        masayudita.push(r)
      }


      console.log(masayudita)

      for (var id = ooo.length - 1; id >= 0; id--) {
        var ss: any = {
          cuenta: ooo[id],
          nombre: "",

        }
        for (var irr = this.lalistacuenta.length - 1; irr >= 0; irr--) {
          if (ooo[id] == this.lalistacuenta[irr].numero) {
            ss.nombre = this.lalistacuenta[irr].nombre
          }
        }

        unamas.push(ss)
      }
      var finis: any = []






      unamas.sort(function (a, b) {
        return (a.cuenta - b.cuenta)
      })

      console.log(unamas)
      for (var iwxw = unamas.length - 1; iwxw >= 0; iwxw--) {
        console.log(unamas[iwxw])
        var qq: any = {
          cuenta: unamas[iwxw].cuenta,
          nombre: unamas[iwxw].nombre,
          total: 0,
          class: "negro"
        }
        var mischamacos = []
        for (var izz = this.lalistacuenta.length - 1; izz >= 0; izz--) {
          if (this.lalistacuenta[izz].papa == unamas[iwxw].cuenta) {
            mischamacos.push(this.lalistacuenta[izz].numero)
          }
        }

        for (var ihh = mischamacos.length - 1; ihh >= 0; ihh--) {
          for (var iuu = masayudita.length - 1; iuu >= 0; iuu--) {
            if (masayudita[iuu].cuenta == mischamacos[ihh]) {
              console.log("mi hijo")
              qq.total = parseFloat(qq.total) + parseFloat(masayudita[iuu].total)
            }
          }
        }




        finis.push(qq)
      }
      console.log(finis)
      finis.sort(function (a, b) {
        return (a.cuenta - b.cuenta)
      })
      for (var pp = finis.length - 1; pp >= 0; pp--) {
        var mihijo = []
        for (var izt = this.lalistacuenta.length - 1; izt >= 0; izt--) {
          if (this.lalistacuenta[izt].papa == finis[pp].cuenta) {
            mihijo.push(this.lalistacuenta[izt].numero)
          }
        }
        for (var ize = mihijo.length - 1; ize >= 0; ize--) {
          for (var isa = finis.length - 1; isa >= 0; isa--) {
            if (mihijo[ize] == finis[isa].cuenta) {
              finis[pp].total = parseFloat(finis[pp].total) + finis[isa].total
            }
          }

        }

      }


      console.log(masayudita)

      for (var lo = masayudita.length - 1; lo >= 0; lo--) {
        var t: any = {
          cuenta: masayudita[lo].cuenta,
          nombre: masayudita[lo].nombre,
          total: masayudita[lo].total
        }
        finis.push(t)
      }
      var elcinco = 0
      var elcuatro = 0

      for (var ipp = finis.length - 1; ipp >= 0; ipp--) {
        if (finis[ipp].cuenta == '1000000') {
          this.eluno1 = parseFloat(finis[ipp].total)
        }
        if (finis[ipp].cuenta == '2000000') {
          this.eldos1 = parseFloat(finis[ipp].total)
        }
      }
      this.elcinco1 = elcinco
      this.elcuatro1 = elcuatro

      this.eltotal2 = parseFloat(this.eluno1) - parseFloat(this.eldos1)
      for (var ip = finis.length - 1; ip >= 0; ip--) {
        if (parseFloat(finis[ip].total) == 0) {
          finis.splice(ip, 1)
        }
      }



      finis.sort(function (a, b) {
        return (a.cuenta - b.cuenta)
      })


      this.lanuevatabla16 = new Tabulator("#otratabla12", {
        data: finis, //set initial table data
        layout: "fitColumns",
        printAsHtml: true,
        pagination: "local",
        paginationSize: 50,
        rowFormatter: function (row) {
          if (row.getData().class == "negro") {
            row.getElement().style.backgroundColor = "#A6A6DF";
          }
        },
        paginationSizeSelector: [10, 50, 100, 200],
        movableColumns: true,
        printHeader: `<img src="./assets/log.jpg" style="width:150px;"></img> <h1>Balance General</h1><h3>Resultado ${this.eltotal2}</h3>`,
        printConfig: {
          columnGroups: true, //do not include column groups in column headers for HTML table
          rowGroups: true, //do not include row groups in HTML table
          columnCalcs: true, //do not include column calcs in HTML table
        },
        columns: [
          { title: "Categoria", field: "cuenta", sorter: 'cuenta' },
          { title: "Cuenta", field: "nombre" },

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






    })





  }
  multiproyectos(x) {
    this.itemspro = []
    var y = {}

    for (var i = x.length - 1; i >= 0; i--) {
      y = {
        "id": i,
        "itemName": x[i].codigo + " " + x[i].nombre,
        "value": x[i]._id
      }
      this.itemspro.push(y)
    }
    this.dropdownSettings11 = {
      singleSelection: false,
      text: "Selecciona los Proyectos",
      selectAllText: 'Elegir todos',
      unSelectAllText: 'Quitar todos',
      enableSearchFilter: true,
      classes: "myclass custom-class"
    };
  }
  auxiliarguardada() {
    this.api.guardarauxiliar(this.aux).subscribe((data) => {
      this.aux = {}
      console.log(data.json())
    })
  }
  reporte1() {

    var instance = $('#jstree_demo_div1').jstree(true);
    var ar = instance._model.data
    console.log(ar)
    var positivo = []
    var negativo = []

    $.each(ar, function (key, value) {
      console.log(key + ": " + value);
      if (value.state.selected == true) {
        positivo.push(key)
      }
    });

    console.log(positivo)
    var xx = {
      desde: this.fechadesde1,
      hasta: this.fechahasta1,
      data: positivo
    }

    this.tablaabierta1 = true
    this.reporteporbuscar = false
    /*var unaayuda:any=[]
    
    for (var i = this.selectedItems2.length - 1; i >= 0; i--) {
      unaayuda.push(this.selectedItems2[i].id)
    }
    var x ={
      desde:this.fechadesde1,
      hasta:this.fechahasta1,
      data:unaayuda
    }*/

    this.api.reporte1(xx).subscribe((data) => {

      var ayuda = data.json()
      var ayudita = []
      var masayudita = []
      var valoresUnico: any = []
      console.log(data.json())
      for (var i = ayuda.length - 1; i >= 0; i--) {
        for (var ie = this.lalistacuenta.length - 1; ie >= 0; ie--) {
          if (ayuda[i].cuenta == this.lalistacuenta[ie].numero) {
            ayudita.push({ cuenta: ayuda[i].cuenta, nombre: this.lalistacuenta[ie].nombre })
          }
        }

      }

      valoresUnico = this.eliminarObjetosDuplicados(ayudita, 'cuenta')
      console.log(valoresUnico)
      for (var ia = valoresUnico.length - 1; ia >= 0; ia--) {
        var r: any = {
          cuenta: valoresUnico[ia].cuenta,
          nombre: valoresUnico[ia].nombre,
          debe: 0,
          haber: 0,

        }
        for (var ib = ayuda.length - 1; ib >= 0; ib--) {
          if (ayuda[ib].cuenta == valoresUnico[ia].cuenta) {
            r.debe = parseFloat(r.debe) + parseFloat(ayuda[ib].debe)
            r.haber = parseFloat(r.haber) + parseFloat(ayuda[ib].haber)

          }
        }
        r.total = parseFloat(r.debe) - parseFloat(r.haber)
        masayudita.push(r)
      }
      console.log(masayudita)
      this.lanuevatabla1 = new Tabulator("#otratabla", {
        data: masayudita, //set initial table data
        layout: "fitColumns",
        printAsHtml: true,
        pagination: "local",
        paginationSize: 50,
        paginationSizeSelector: [10, 50, 100, 200],
        movableColumns: true,
        printHeader: "<h1>Gastos</h1>",
        printConfig: {
          columnGroups: true, //do not include column groups in column headers for HTML table
          rowGroups: true, //do not include row groups in HTML table
          columnCalcs: true, //do not include column calcs in HTML table
        },
        columns: [
          { title: "Categoria", field: "cuenta" },
          { title: "Cuenta", field: "nombre" },
          {
            title: "Debe", field: "debe", topCalc: "sum", topCalcParams: {
              precision: 2,
            }, formatter: "money", formatterParams: {
              decimal: ",",
              thousand: ".",
              symbol: "Bs",
              symbolAfter: "Bs",
              precision: 2,
            }
          },
          {
            title: "Haber", field: "haber", topCalc: "sum", topCalcParams: {
              precision: 2,
            }, formatter: "money", formatterParams: {
              decimal: ",",
              thousand: ".",
              symbol: "Bs",
              symbolAfter: "Bs",
              precision: 2,
            }
          },
          {
            title: "Total", field: "total", topCalc: "sum", topCalcParams: {
              precision: 2,
            }, formatter: "money", formatterParams: {
              decimal: ",",
              thousand: ".",
              symbol: "Bs",
              symbolAfter: "Bs",
              precision: 2,
            }
          },
        ],
      });


    })
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
  cambiar() {
    if (this.tipocuenta == true) {
      this.api.cuentaslista(this.cuentanumerito).subscribe((data) => {
        console.log(data.json())
        this.num = data.json()
      })
    }
    console.log(this.tipocuenta)
  }
  guardar() {
    if (this.elcomprobante.entidad != "" && this.elcomprobante.proyecto != "" && this.elcomprobante.documento != "" && this.elcomprobante.numero != 0) {
      var o = this.latabla.getData(false)
      var unaxu = 0
      for (var ia = o.length - 1; ia >= 0; ia--) {
        unaxu = 0
        for (var ib = o[ia].length - 1; ib >= 0; ib--) {

          if (o[ia][ib] != "") {
            unaxu = 1
          }
        }
        if (unaxu == 0) {
          o.splice(ia, 1);
        }

      }

      var ayudita = new Date(this.fechaactual)
      var dia
      var mes
      var ano
      if ((ayudita.getMonth() + 1) < 10) {
        mes = '0' + (ayudita.getMonth() + 1)
      } else {
        mes = ayudita.getMonth() + 1
      }
      if (ayudita.getDate() < 10) { dia = '0' + ayudita.getDate() } else {
        dia = ayudita.getDate()
      }
      ano = ayudita.getFullYear()
      this.elcomprobante.fecha = ano + "-" + mes + "-" + dia
      var paraenvio = {
        informacion: this.elcomprobante,
        datos: o
      }
      console.log(paraenvio)
      this.api.cargarcomprobante(paraenvio).subscribe((data) => {
        console.log(data)
        this.maximo++
        this.funcion = "actualizar"
        swal("Se agrego correctamente!", "Finalizar!", "success");
      })
    } else {

      swal("No llenaste todos los campos!", "Intentar de nuevo!", "error");
    }




  }





  actualizacion() {
    var o = this.latabla.getData(false)
    var unaxu = 0
    for (var ia = o.length - 1; ia >= 0; ia--) {
      unaxu = 0
      for (var ib = o[ia].length - 1; ib >= 0; ib--) {

        if (o[ia][ib] != "") {
          unaxu = 1
        }
      }
      if (unaxu == 0) {
        o.splice(ia, 1);
      }

    }
    var ayudita = new Date(this.fechaactual)
    var dia
    var mes
    var ano
    if ((ayudita.getMonth() + 1) < 10) {
      mes = '0' + (ayudita.getMonth() + 1)
    } else {
      mes = ayudita.getMonth() + 1
    }
    if (ayudita.getDate() < 10) { dia = '0' + ayudita.getDate() } else {
      dia = ayudita.getDate()
    }
    ano = ayudita.getFullYear()
    this.elcomprobante.fecha = ano + "-" + mes + "-" + dia
    var paraenvio = {
      informacion: this.elcomprobante,
      datos: o,
      compr: this.servidor
    }
    console.log(paraenvio)
    this.api.actualizarcomprobante(paraenvio).subscribe((data) => {
      swal("Se actualizo correctamente!", "Finalizar!", "success");
    })

  }


  cuentaguardada() {
    console.log(this.cuenta)
    this.api.nuevacuenta(this.cuenta).subscribe((data) => {
      if (data.json().mensaje == "ya existe") {
        swal("Ya existe una cuenta con ese numero!", "Finalizar!", "error");
      } else {
        console.log(data.json())
        swal("Se guardo correctamente!", "Finalizar!", "success");
        this.cuenta = {}
        this.ngOnInit()
      }

    })
  }
  aver(x) {
    console.log(x)
    if (x.index == 1) {
      this.cuentascontables = true
      this.loscomprobantes = false
      if (this.contador == 1) {
        this.comprobanteelegido()
        this.contador = 2

      }

    } else if (x.index == 0) {

      this.loscomprobantes = true
      this.cuentascontables = false
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
  onItemSelect1(item: any) {
    console.log(item);
    console.log(this.selectedItems);
  }
  OnItemDeSelect1(item: any) {
    console.log(item);
    console.log(this.selectedItems);
  }
  onSelectAll1(items: any) {
    console.log(items);
  }
  onDeSelectAll1(items: any) {
    console.log(items);
  }
  onItemSelect2(item: any) {
    console.log(item);
    console.log(this.selectedItems);
  }
  OnItemDeSelect2(item: any) {
    console.log(item);
    console.log(this.selectedItems);
  }
  onSelectAll2(items: any) {
    console.log(items);
  }
  onDeSelectAll2(items: any) {
    console.log(items);
  }
  imprimir(x) {
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
  imprimir1(x) {
    console.log(x)
    switch (x) {
      case 1:
        this.lanuevatabla1.print(false, true);
        break;
      case 2:
        this.lanuevatabla1.download("csv", "data.csv");
        break;
      case 3:
        this.lanuevatabla1.download("json", "data.json");
        break;
      case 4:
        this.lanuevatabla1.download("xlsx", "data.xlsx", { sheetName: "Reporte Casa Grande" });
        break;
      default:
        this.lanuevatabla1.download("pdf", "data.pdf", {
          orientation: "portrait", //set page orientation to portrait
          title: "Example Report", //add title to report
        });
        break;
    }

  }
  imprimir11(x) {
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
        this.lanuevatabla15.download("xlsx", "data.xlsx", { sheetName: "Reporte Casa Grande" });
        break;
      default:
        this.lanuevatabla15.download("pdf", "data.pdf", {
          orientation: "portrait", //set page orientation to portrait
          title: "Example Report", //add title to report
        });
        break;
    }

  }
  imprimir111(x) {
    console.log(x)
    switch (x) {
      case 1:
        this.lanuevatabla16.print(false, true);
        break;
      case 2:
        this.lanuevatabla16.download("csv", "data.csv");
        break;
      case 3:
        this.lanuevatabla16.download("json", "data.json");
        break;
      case 4:
        this.lanuevatabla16.download("xlsx", "data.xlsx", { sheetName: "Reporte Casa Grande" });
        break;
      default:
        this.lanuevatabla16.download("pdf", "data.pdf", {
          orientation: "portrait", //set page orientation to portrait
          title: "Example Report", //add title to report
        });
        break;
    }

  }
  diferente(e) {
    console.log(e)
    this.archivo = e.target.files
  }
  enviar() {


    var x = new FormData()
    console.log(this.archivo)
    for (var i = this.archivo.length - 1; i >= 0; i--) {
      x.append("uploads[]", this.archivo[i], this.archivo[i].name)
    }
    console.log(x)
    this.api.importar(x).subscribe((data) => {
      console.log(data.json())
      var o = data.json().mensaje[0].path
      var res = String.fromCharCode(92)
      var res1 = String.fromCharCode(47)
      var l = o.split(res)
      var l1 = o.split(res1)
      if (l.length > 1) {
        this.importar(l[l.length - 1])
      } else {
        this.importar(l1[l1.length - 1])
      }
    })
  }
  ExcelDateToJSDate(serial) {
    var utc_days = Math.floor(serial - 25569);
    var utc_value = utc_days * 86400;
    var date_info = new Date(utc_value * 1000);

    var fractional_day = serial - Math.floor(serial) + 0.0000001;

    var total_seconds = Math.floor(86400 * fractional_day);

    var seconds = total_seconds % 60;

    total_seconds -= seconds;

    var hours = Math.floor(total_seconds / (60 * 60));
    var minutes = Math.floor(total_seconds / 60) % 60;

    return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds);
  }
  enviar1() {
    this.api.llamamiento().subscribe((data) => {
      swal("Se agrego correctamente!", "Finalizar!", "success");
      console.log("hecho")
      this.paso1 = true
      this.paso2 = false
      this.paso3 = false
    })
  }
  importar(x) {
    console.log(x)
    var url = "assets/excel/" + x;
    var oReq = new XMLHttpRequest();
    oReq.open("GET", url, true);
    oReq.responseType = "arraybuffer";

    oReq.onload = (e) => {
      var arraybuffer = oReq.response;

      /* convert data to binary string */
      var data = new Uint8Array(arraybuffer);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");

      /* Call XLSX */
      var workbook = XLSX.read(bstr, { type: "binary" });

      /* DO SOMETHING WITH workbook HERE */
      var first_sheet_name = workbook.SheetNames[0];
      /* Get worksheet */
      var worksheet = workbook.Sheets[first_sheet_name];
      console.log(XLSX.utils.sheet_to_json(worksheet, { raw: true }));
      var resultado = XLSX.utils.sheet_to_json(worksheet, { raw: true })
      var ayuda = []
      for (var ia = resultado.length - 1; ia >= 0; ia--) {
        ayuda.push(resultado[ia].numero)

      }
      var sinRepetidos = ayuda.filter((valor, indiceActual, arreglo) => arreglo.indexOf(valor) === indiceActual);
      console.log(sinRepetidos)
      var loscompro: any = []
      for (var ib = sinRepetidos.length - 1; ib >= 0; ib--) {
        var ee = 0
        var w: any = {

          numero: sinRepetidos[ib],
          estado: "abierto",
          detalle: []
        }
        for (var ic = resultado.length - 1; ic >= 0; ic--) {

          //comprobantes
          if (String(sinRepetidos[ib]) == String(resultado[ic].numero)) {
            var detall: any = {
              original: "",
              recurso: "",
              partida: "",
              fuente: "",

            }
            detall.categoria = resultado[ic].categoria
            detall.cuenta = resultado[ic].cuenta
            detall.auxiliar = resultado[ic].auxiliar
            detall.debe = resultado[ic].debebs
            detall.haber = resultado[ic].haberbs
            detall.glosa = resultado[ic].glosa
            detall.cheque = resultado[ic].cheque
            detall.numeroantiguo = resultado[ic].numero




            if (ee == 0) {
              w.entidad = resultado[ic].entidad,
                w.proyecto = resultado[ic].fondo,
                //w.fecha=this.ExcelDateToJSDate(resultado[ic].fecha)
                //w.categoria=resultado[ic].categoria
                w.glosa = resultado[ic].glosa
              switch (resultado[ic].clase) {
                case "1":
                  w.documento = "ingreso"
                  break;
                case "2":
                  w.documento = "egreso"
                  break;
                case "3":
                  w.documento = "traspaso"
                  break;
                case "4":
                  w.documento = "apertura"
                  break;

                default:
                  // code...
                  break;
              }
              ee = 1

            }
            w.detalle.push(detall)
          }






        }
        loscompro.push(w)
      }
      var uu = []
      var uuu = []
      console.log('LOS COMPR', loscompro)
      for (var ix = loscompro.length - 1; ix >= 0; ix--) {
        uu.push(loscompro[ix])
        if (ix % 5 == 0) {
          uuu.push(uu)
          uu = []
        }
      }
      console.log(uuu)
      for (var icd = uuu.length - 1; icd >= 0; icd--) {
        this.api.agregarcomprobantesimportados(uuu[icd]).subscribe((data) => {
          console.log(data.json())

        })
      }
      swal("Se agrego correctamente!", "Finalizar!", "success");
      this.paso1 = false
      this.paso2 = true
      this.paso3 = false
      /**/
      console.log(loscompro)
    }

    oReq.send();
  }
  customFilter(data) {
    return data.car && data.rating < 3;
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

  abrirPrimerReporte() {
    this.router.navigate(['contabilidad/reporte_ep']);
  }
  abrirPrimerReporte2() {
    this.router.navigate(['contabilidad/reporte_ep1']);
  }

  abrirSegundoReporte() {
    this.router.navigate(['contabilidad/reporte_lb']);
  }

  //Update filters on value change
  seleccionotodo(x) {
    console.log(this.primero, this.segundo)
    if (x == 1) {
      if (this.primero == true) {
        var instance1 = $('#jstree_demo_div2').jstree(true);
        var primerarbol = instance1._model.data
        $.each(primerarbol, function (key, value) {
          $('#jstree_demo_div2')
            .jstree('select_node', key);

        });
      } else {
        var instance1 = $('#jstree_demo_div2').jstree(true);
        var primerarbol = instance1._model.data
        $.each(primerarbol, function (key, value) {
          $('#jstree_demo_div2')
            .jstree('deselect_node', key);

        });
      }


    } else {
      if (this.segundo == true) {
        var instance1 = $('#jstree_demo_div3').jstree(true);
        var primerarbol = instance1._model.data
        $.each(primerarbol, function (key, value) {
          $('#jstree_demo_div3')
            .jstree('select_node', key);

        });
      } else {
        var instance1 = $('#jstree_demo_div3').jstree(true);
        var primerarbol = instance1._model.data
        $.each(primerarbol, function (key, value) {
          $('#jstree_demo_div3')
            .jstree('deselect_node', key);

        });
      }

    }



  }
  reporte() {

    var instance1 = $('#jstree_demo_div2').jstree(true);
    var primerarbol = instance1._model.data

    var instance2 = $('#jstree_demo_div3').jstree(true);
    var segundoarbol = instance2._model.data







    this.tablaabierta = true
    var cuentas = this.selectedItems1
    var autos = this.selectedItems
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
    this.api.AuxiliarListaGeneral().subscribe((respuesta) => {
      var auxiliares = respuesta.json();
      this.api.buscarotrocomprobante2(x).subscribe((data) => {
        console.log(data.json());

        // ADICION DE SALDOS
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
        this.lanuevatabla = new Tabulator("#mitabla", {
          data: datos, //set initial table data,
          groupClosedShowCalcs: true,
          groupBy: this.losGrupos,
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
          printHeader: `<img src="./assets/log.jpg" style="width:150px;float:left;"></img> <h1>Casa Grande Constructora</h1><h3>Desde: 
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
            { title: "Categoria", field: "categoria" },
            { title: "Cuenta", field: "cuenta" },
            { title: "Nombre", field: "comprobante.numeroimportado" },
            { title: "Auxiliar", field: "auxiliar" },
            { title: "Auxiliar", field: "auxiliarAyuda" },
            { title: "Fecha", field: "comprobante.fecha" },
            { title: "Glosa", field: "glosa", width: 200, height: 100, formatter: "textarea" },
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
            { title: "Debe", field: "debe", bottomCalc: "sum" },
            { title: "Haber", field: "haber", bottomCalc: "sum" },
            { title: "Saldo", field: "saldo", bottomCalc: "sum" }

          ],
        });

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
        this.debe = parseFloat(todito).toFixed(2)
        this.haber = parseFloat(todito1).toFixed(2)

      })
    })



  }
  limpieza() {
    $("#filter-field").val("");
    $("#filter-type").val("=");
    $("#filter-value").val("");

    this.lanuevatabla.clearFilter();
  }
  applyFilter(filterValue: string) {
    this.principal.filter = filterValue.trim().toLowerCase();

    if (this.principal.paginator) {
      this.principal.paginator.firstPage();
    }
  }




  pasarreporte() {
    console.log(this.miarbol1, this.miarbol2)
    this.tiposreporte = false
    $('#jstree_demo_div2').jstree({
      'core': {
        'data': this.miarbol1,

      },

      'checkbox': {
        "keep_selected_style": false,
        three_state: true, cascade: 'up'
      },
      'plugins': ["checkbox"]
    });

    $('#jstree_demo_div3').jstree({
      'core': {
        'data': this.miarbol2,

      },

      'checkbox': {
        "keep_selected_style": false,
        three_state: true, cascade: 'up'
      },
      'plugins': ["checkbox"]
    });
  }

  ngOnInit() {
    this.api.proyectoslista

    //Clear filters on "Clear Filters" button click
    this.api.cuentaslista(this.cuentanumerito).subscribe((data) => {
      console.log(data.json())
      this.num = data.json()
      this.num.sort(function (a, b) {
        return (a.numero - b.numero)
      })
    })
    /*this.api.todasauxiliares().subscribe((data) => {
      var r = data.json()
      var armado = []
      for (var i = r.length - 1; i >= 0; i--) {
        armado.push(r[i].cuenta)
        this.todasauxiliares.push(r[i].cuenta.numero + " " + r[i].nombre)
        this.elresto.push(r[i].nombre)
      }
      var nuevo: any = this.eliminarObjetosDuplicados(armado, 'numero')
      console.log(nuevo)
      var aa = []
      for (var ib = nuevo.length - 1; ib >= 0; ib--) {
        aa = []
        for (var ia = r.length - 1; ia >= 0; ia--) {
          if (nuevo[ib].numero == r[ia].cuenta.numero) {
            aa.push(r[ia].nombre)
          }
        }
        nuevo[ib].midato = aa
      }
      this.todasauxiliares = nuevo
   
    })*/

    this.api.bienes().subscribe((data) => {
      var t = data.json()
      var tt = []
      for (var i = t.length - 1; i >= 0; i--) {
        var u = {
          id: t[i]._id,
          itemName: t[i].nombre + " " + t[i].descripcion
        }
        tt.push(u)
      }
      this.dropdownList = tt
    })
    this.dropdownSettings = {
      singleSelection: false,
      text: "Selecciona la Categoria",
      selectAllText: 'Marcar Todos',
      unSelectAllText: 'Desmarcar Todos',
      enableSearchFilter: true,
      classes: "myclass custom-class"
    };
    this.api.cuentaslista(this.cuentanumerito).subscribe((data) => {




      var oto = data.json()
      console.log(data.json())
      this.principal = new MatTableDataSource(oto);
      this.principal.paginator = this.paginator;
      this.principal.sort = this.sort;




    })
    this.dropdownSettings1 = {
      singleSelection: false,
      text: "Selecciona la Cuenta",
      selectAllText: 'Marcar Todos',
      unSelectAllText: 'Desmarcar Todos',
      enableSearchFilter: true,
      classes: "myclass custom-class"
    };
    this.dropdownSettings2 = {
      singleSelection: false,
      text: "Selecciona la Cuenta",
      selectAllText: 'Marcar Todos',
      unSelectAllText: 'Desmarcar Todos',
      enableSearchFilter: true,
      classes: "myclass custom-class"
    };



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
          id: respuestaAux.json()[i]._id,
          itemName: respuestaAux.json()[i].codigo + " " + respuestaAux.json()[i].nombre
        }
        pi.push(u)
      }
      this.dropdownListAux = pi;
    })



    this.loscomprobantes = true
    this.cuentascontables = false
    this.api.proyectoslista().subscribe((data) => {
      this.proyect = data.json()
      this.multiproyectos(this.proyect)
      this.api.lascuentitas().subscribe((data) => {
        this.lalistacuenta = data.json()
        console.log(this.lalistacuenta)
        var x = data.json()
        for (var i = x.length - 1; i >= 0; i--) {
          this.todascuentas.push({ id: x[i].numero, name: x[i].numero + " " + x[i].nombre })
        }
        /*var tq=data.json()
     var ttq=[]
     for (var i = tq.length - 1; i >= 0; i--) {
       var u={
         id:tq[i].numero ,
         itemName:tq[i].numero
       }
       ttq.push(u)
     }
     this.dropdownList1=ttq
     this.dropdownList2=ttq*/



        var unaayuda = []
        var dosayuda = data.json()
        for (var iz = dosayuda.length - 1; iz >= 0; iz--) {
          if (dosayuda[iz].papa == "" || dosayuda[iz].papa == undefined) {
            unaayuda.push({ "id": dosayuda[iz].numero, ayuda: dosayuda[iz]._id, "parent": "#", "text": dosayuda[iz].numero + " " + dosayuda[iz].nombre })
          } else {
            unaayuda.push({ "id": dosayuda[iz].numero, ayuda: dosayuda[iz]._id, "parent": dosayuda[iz].papa, "text": dosayuda[iz].numero + " " + dosayuda[iz].nombre })
          }

        }
        this.miarbolito = unaayuda
        this.miarbol1 = unaayuda
        console.log(this.miarbolito)

      })

      //armando el arbolito








      this.api.categorias().subscribe((data) => {
        var w = data.json()
        var ota = []
        for (var i = w.length - 1; i >= 0; i--) {

          if (w[i].padre == "" || w[i].padre == undefined) {
            ota.push({ "id": w[i].codigo, "parent": "#", "text": w[i].codigo + " " + w[i].nombre })
          } else {
            var u = 0
            for (var iq = w.length - 1; iq >= 0; iq--) {
              if (w[i].padre == w[iq].codigo) {
                u = 1
              }
            }
            if (u == 1) {
              ota.push({ "id": w[i].codigo, "parent": w[i].padre, "text": w[i].codigo + " " + w[i].nombre })
            } else {

              ota.push({ "id": w[i].codigo, "parent": "#", "text": w[i].codigo + " " + w[i].nombre })
            }
          }



          this.lacategoria.push({ id: w[i]._id, name: w[i].codigo + " " + w[i].nombre })
        }
        this.miarbol2 = ota
      })
    })

    //$("#datepicker").datepicker()
  }


  cambiofecha() {
    $('#jstree_demo_div1').jstree({
      'core': {
        'data': this.miarbolito,

      },

      'checkbox': {
        "keep_selected_style": false,
        three_state: true, cascade: 'up'
      },
      'plugins': ["checkbox"]
    });
  }
  traercomprobante() {
    jexcel.destroy(document.getElementById('my-spreadsheet'), false);

    if (this.elcomprobante.entidad != "" && this.elcomprobante.proyecto != "" && this.elcomprobante.documento != "") {
      this.api.numerocomprobante(this.elcomprobante).subscribe((data) => {
        var miayuda = 0
        if (data.json().length >= 1) {
          this.maximo = data.json().length
          this.elcomprobante.numero = miayuda
        } else {
          this.maximo = 0
          this.elcomprobante.numero = 0
        }

      })
    } else {
      this.funcion = false

    }
  }


  otrocomprobante() {
    console.log(this.elcomprobante)

    this.api.mostrarunicocomprobante(this.elcomprobante).subscribe((data) => {

      console.log(data.json())
      var u = data.json().datos
      var ayuda = []
      var grande = []
      if (data.json().mensaje == 'no ay nada') {
        this.funcion = "nuevo"
      } else {
        this.elcomprobante.estado = data.json().inf.estado
        this.servidor = data.json().inf._id
        this.elcomprobante.documento = data.json().inf.documento
        this.elcomprobante.entidad = data.json().inf.entidad
        this.elcomprobante.glosa = data.json().inf.glosa
        var a = data.json().inf.fecha.split("-")
        this.fechaactual = new Date(a[0], (parseFloat(a[1]) - 1), a[2])
        this.funcion = "actualizar"
        for (var i = u.length - 1; i >= 0; i--) {
          console.log(u[i])
          ayuda = []
          var uu = 0
          var u2 = 0
          var u3 = 0
          for (const x in u[i]) {
            if (x == 'categoria') {
              uu = 1

            }
            if (x == 'numerodecategoria') {
              u2 = 1
              console.log(u[i][x])
            }
            if (x == 'nombre') {
              u3 = 1
            }

            if (x == "_id" || x == "__v" || x == "comprobante") {

            } else {
              if (x == 'categoria') {
                ayuda.splice(2, 0, u[i][x])

              } else {
                ayuda.push(u[i][x])
              }

            }


          }
          if (uu == 0) {
            ayuda.splice(1, 0, "");
          }
          if (u2 == 0) {
            ayuda.splice(4, 0, "");
          }
          if (u3 == 0) {
            ayuda.splice(8, 0, "");
          }
          grande.push(ayuda)
        }
        if (this.elcomprobante.estado == "cerrado") {
          // code..
          this.funcion = "nada1"
        } else {
          this.funcion = "actualizar"
        }

      }
      console.log(grande)
      this.data = grande
      jexcel.destroy(document.getElementById('my-spreadsheet'), false);

      if (this.elcomprobante.estado == "abierto") {
        this.latabla = jexcel(document.getElementById('my-spreadsheet'), {
          minDimensions: [11, 99],
          colWidths: this.tamanotabla,

          data: this.data,
          tableOverflow: true,
          tableHeight: '400px',
          tableWidth: '70em',
          columns: [
            { title: 'Original' },
            { title: 'Recurso' },
            { title: 'Categoria', type: 'autocomplete', source: this.lacategoria, width: 300 },
            { title: 'Numero de Categoria' },
            { title: 'Partida' },
            { title: 'Fuente' },
            { title: 'Cuenta', type: 'autocomplete', source: this.todascuentas, class: "comida" },
            { title: 'Auxiliar', type: 'autocomplete', source: this.elresto, filter: this.dropdownFilter },
            { title: 'Nombre', type: 'text', width: 300 },
            { title: 'Debe' },
            { title: 'Haber' },
            { title: 'Glosa', width: 700 },
            { title: 'Cheque' },
            { title: 'Referencia' },

            { title: 'Fecha Emisión' },
            { title: 'Vencimiento' },


          ],
          onselection: (instance, x1, y1, x2, y2, origin) => {

            this.lacelda = jexcel.getColumnNameFromId([x1, y1]);


          },
          onchange: (instance, cell, x, y, value) => {




            var cellName = jexcel.getColumnNameFromId([x, y]);

            if (x == 5) {
              var w = {
                codigo: value
              }
              this.api.nombrecuenta(w).subscribe((data) => {
                console.log(data.json())
                var fila = jexcel.getColumnNameFromId([7, y]);
                this.latabla.setValue(fila, data.json().nombre)
              })
            } else if (x == 8 || x == 9) {
              var fila = jexcel.getColumnNameFromId([10, y]);
              this.latabla.setValue(fila, this.elcomprobante.glosa)
            }

          }

        });
      } else {
        this.latabla = jexcel(document.getElementById('my-spreadsheet'), {
          minDimensions: [11, 100],
          colWidths: this.tamanotabla,
          tableOverflow: true,
          tableHeight: '400px',
          tableWidth: '70em',
          data: this.data,

          columns: [
            { title: 'Original', readOnly: true },
            { title: 'Recurso', readOnly: true },
            { title: 'Categoria', readOnly: true, type: 'autocomplete', source: this.lacategoria, width: 300 },
            { title: 'Numero de Categoria', readOnly: true },
            { title: 'Partida', readOnly: true },
            { title: 'Fuente', readOnly: true },
            { title: 'Cuenta', type: 'autocomplete', source: this.todascuentas },
            { title: 'Auxiliar', readOnly: true },
            { title: 'Nombre', readOnly: true, width: 300 },
            { title: 'Debe', readOnly: true },
            { title: 'Haber', readOnly: true },
            { title: 'Glosa', readOnly: true, width: 700 },
            { title: 'Cheque', readOnly: true },
            { title: 'Referencia', readOnly: true },

            { title: 'Fecha Emisión', readOnly: true },
            { title: 'Vencimiento', readOnly: true },


          ],

        });
      }



    })
  }
  buscar() {

    var x = {
      palabra: this.buscador
    }
    this.api.buscardorcomprobantes(x).subscribe((data) => {

      this.posiblescomprobantes = data.json()
    })
  }
  buscar1() {

    var x = {
      palabra: this.buscador1
    }
    this.api.buscardorcuentas(x).subscribe((data) => {

      this.posiblescuentas = data.json()
    })
  }
  agregado1(x) {
    this.latabla.setValue(this.lacelda, "")
    this.latabla.setValue(this.lacelda, x.numero)
  }
  agregado(x) {
    console.log(this.dd)

    this.funcion = "actualizar"
    jexcel.destroy(document.getElementById('my-spreadsheet'), false);
    this.elcomprobante = x
    this.traercomprobante()
    this.elcomprobante = x
    this.fechaactual = x.fecha
    this.api.buscardetalle(x).subscribe((data) => {
      console.log(data.json())
      var u = data.json()
      var grande = []
      var ayuda = []
      for (var i = u.length - 1; i >= 0; i--) {
        ayuda = []
        for (const x in u[i]) {
          console.log(x)
          if (x == "_id" || x == "__v" || x == "comprobante") {

          } else {
            if (x == 'categoria') {
              ayuda.splice(2, 0, u[i][x]);
            } else {
              ayuda.push(u[i][x])
            }

          }


        }
        ayuda.splice(7, 0, "");
        grande.push(ayuda)
      }
      this.data = grande
      console.log(this.data)
      if (this.elcomprobante.estado == "abierto") {
        this.latabla = jexcel(document.getElementById('my-spreadsheet'), {
          minDimensions: [11, 99],
          colWidths: this.tamanotabla,

          data: this.data,
          tableOverflow: true,
          tableHeight: '400px',
          tableWidth: '70em',
          columns: [
            { title: 'Original' },
            { title: 'Recurso' },
            { title: 'Categoria', type: 'autocomplete', source: this.lacategoria, width: 300 },
            { title: 'Numero de Categoria' },
            { title: 'Partida' },
            { title: 'Fuente' },
            { title: 'Cuenta', type: 'autocomplete', source: this.todascuentas, class: "comida" },
            { title: 'Auxiliar', type: 'autocomplete', source: this.elresto, filter: this.dropdownFilter },
            { title: 'Nombre', type: 'text', width: 300 },
            { title: 'Debe' },
            { title: 'Haber' },
            { title: 'Glosa', width: 700 },
            { title: 'Cheque' },
            { title: 'Referencia' },

            { title: 'Fecha Emisión' },
            { title: 'Vencimiento' },


          ],
          onselection: (instance, x1, y1, x2, y2, origin) => {

            this.lacelda = jexcel.getColumnNameFromId([x1, y1]);


          },
          onchange: (instance, cell, x, y, value) => {




            var cellName = jexcel.getColumnNameFromId([x, y]);

            if (x == 5) {
              var w = {
                codigo: value
              }
              this.api.nombrecuenta(w).subscribe((data) => {
                console.log(data.json())
                var fila = jexcel.getColumnNameFromId([7, y]);
                this.latabla.setValue(fila, data.json().nombre)
              })
            } else if (x == 8 || x == 9) {
              var fila = jexcel.getColumnNameFromId([10, y]);
              this.latabla.setValue(fila, this.elcomprobante.glosa)
            }

          }

        });
      } else {
        this.latabla = jexcel(document.getElementById('my-spreadsheet'), {
          minDimensions: [11, 100],
          colWidths: this.tamanotabla,
          tableOverflow: true,
          tableHeight: '400px',
          tableWidth: '70em',
          data: this.data,

          columns: [
            { title: 'Original', readOnly: true },
            { title: 'Recurso', readOnly: true },
            { title: 'Categoria', readOnly: true, type: 'autocomplete', source: this.lacategoria, width: 300 },
            { title: 'Numero de Categoria', readOnly: true },
            { title: 'Partida', readOnly: true },
            { title: 'Fuente', readOnly: true },
            { title: 'Cuenta', type: 'autocomplete', source: this.todascuentas },
            { title: 'Auxiliar', readOnly: true },
            { title: 'Nombre', readOnly: true, width: 300 },
            { title: 'Debe', readOnly: true },
            { title: 'Haber', readOnly: true },
            { title: 'Glosa', readOnly: true, width: 700 },
            { title: 'Cheque', readOnly: true },
            { title: 'Referencia', readOnly: true },

            { title: 'Fecha Emisión', readOnly: true },
            { title: 'Vencimiento', readOnly: true },


          ],

        });
      }




    })
  }
  dropdownFilter = (instance, cell, c, r, source) => {
    console.log(instance.jexcel.getValueFromCoords(c - 1, r))

    var value = instance.jexcel.getValueFromCoords(c - 1, r);
    var ayu = 0
    var ayud: any = []
    for (var i = this.todasauxiliares.length - 1; i >= 0; i--) {
      if (value == this.todasauxiliares[i].numero) {
        ayud = this.todasauxiliares[i].midato
        ayu = 1
      }
    }
    if (ayu == 1) {
      return ayud
    } else {
      return []
    }
  }
  construccion() {
    this.data = []
    jexcel.destroy(document.getElementById('my-spreadsheet'), false);

    this.latabla = jexcel(document.getElementById('my-spreadsheet'), {
      minDimensions: [11, 99],
      colWidths: this.tamanotabla,

      data: this.dd,
      tableOverflow: true,
      tableHeight: '400px',
      tableWidth: '70em',
      columns: [
        { title: 'Original' },
        { title: 'Recurso' },
        { title: 'Categoria', type: 'autocomplete', source: this.lacategoria, width: 300 },
        { title: 'Numero de Categoria' },
        { title: 'Partida' },
        { title: 'Fuente' },
        { title: 'Cuenta', type: 'autocomplete', source: this.todascuentas, class: "comida" },
        { title: 'Auxiliar', type: 'autocomplete', source: this.elresto, filter: this.dropdownFilter },
        { title: 'Nombre', type: 'text', width: 300 },
        { title: 'Debe' },
        { title: 'Haber' },
        { title: 'Glosa', width: 700 },
        { title: 'Cheque' },
        { title: 'Referencia' },

        { title: 'Fecha Emisión' },
        { title: 'Vencimiento' },


      ],
      onselection: (instance, x1, y1, x2, y2, origin) => {

        this.lacelda = jexcel.getColumnNameFromId([x1, y1]);


      },
      onchange: (instance, cell, x, y, value) => {




        var cellName = jexcel.getColumnNameFromId([x, y]);

        if (x == 5) {
          var w = {
            codigo: value
          }
          this.api.nombrecuenta(w).subscribe((data) => {
            console.log(data.json())
            var fila = jexcel.getColumnNameFromId([7, y]);
            this.latabla.setValue(fila, data.json().nombre)
          })
        } else if (x == 8 || x == 9) {
          var fila = jexcel.getColumnNameFromId([10, y]);
          this.latabla.setValue(fila, this.elcomprobante.glosa)
        }

      }

    });
    $(".dropdown").keydown((event) => {

      if (event.which == 113) {
        $('#test-modal-115').modal('show')
      }
      console.log(String.fromCharCode(event.which) + " es: " + event.which)
    });

  }
  nuevocomp() {
    this.elcomprobante.estado = "abierto"
    this.elcomprobante.numero = this.maximo + 1
    this.construccion()
    this.funcion = "nuevo"
    this.elcomprobante.glosa = ""
  }
  otro() {
    var o = this.latabla.getData(false)
    console.log(o)
  }
  comprobanteelegido() {


    this.latabla = jexcel(document.getElementById('my-spreadsheet'), {
      minDimensions: [11, 99],
      colWidths: this.tamanotabla,

      data: this.dd,
      tableOverflow: true,
      tableHeight: '400px',
      tableWidth: '70em',
      columns: [
        { title: 'Original' },
        { title: 'Recurso' },
        { title: 'Categoria', type: 'autocomplete', source: this.lacategoria, width: 300 },
        { title: 'Numero de Categoria' },
        { title: 'Partida' },
        { title: 'Fuente' },
        { title: 'Cuenta', type: 'autocomplete', source: this.todascuentas, class: "comida" },
        { title: 'Auxiliar', type: 'autocomplete', source: this.elresto, filter: this.dropdownFilter },
        { title: 'Nombre', type: 'text', width: 300 },
        { title: 'Debe' },
        { title: 'Haber' },
        { title: 'Glosa', width: 700 },
        { title: 'Cheque' },
        { title: 'Referencia' },

        { title: 'Fecha Emisión' },
        { title: 'Vencimiento' },


      ],
      onselection: (instance, x1, y1, x2, y2, origin) => {

        this.lacelda = jexcel.getColumnNameFromId([x1, y1]);


      },
      onchange: (instance, cell, x, y, value) => {




        var cellName = jexcel.getColumnNameFromId([x, y]);

        if (x == 5) {
          var w = {
            codigo: value
          }
          this.api.nombrecuenta(w).subscribe((data) => {
            console.log(data.json())
            var fila = jexcel.getColumnNameFromId([7, y]);
            this.latabla.setValue(fila, data.json().nombre)
          })
        } else if (x == 8 || x == 9) {
          var fila = jexcel.getColumnNameFromId([10, y]);
          this.latabla.setValue(fila, this.elcomprobante.glosa)
        }

      }

    });
    $(".dropdown").keydown((event) => {

      if (event.which == 113) {
        $('#test-modal-115').modal('show')
      }
      console.log(String.fromCharCode(event.which) + " es: " + event.which)
    });

  }

}
