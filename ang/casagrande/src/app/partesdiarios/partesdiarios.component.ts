import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PrincipalService } from '../servicio/principal.service'
import { FormControl } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { Chart } from 'chart.js';
import { Socket } from 'ngx-socket-io';
import Tabulator from 'tabulator-tables';
import { NuevoIngresoComponent } from './nuevo-ingreso/nuevo-ingreso.component';
import { MatDialog } from '@angular/material';
import { element } from 'protractor';

declare var jsPDF: any;
//declare var Tabulator:any
declare var $: any
declare var swal: any
declare var Swal: any
declare var XLSX: any
@Component({
  selector: 'app-partesdiarios',
  templateUrl: './partesdiarios.component.html',
  styleUrls: ['./partesdiarios.component.css']
})
export class PartesdiariosComponent implements OnInit {

  misPartes: any = [];


  elAprovechamiento: any = 0;
  listadePrecios: any = []




  desde1: any = new Date()
  hasta1: any = new Date()

  seleccionado: any
  seleccionado1: any
  losprint: any = []
  losnoprint: any = []




  seleccion: any
  toppings = new FormControl();
  miconte: any = [
    {
      title: 'Fecha', field: 'fecha', width: 150, topCalc: function (values, data, calcParams) {
        console.log('a analizar', data)
        //values - array of column values
        //data - all table data
        //calcParams - params passed from the column definition object
        var sumi: any = 0;
        var hora: any = 0;
        var calc = 0;

        data.forEach(function (value) {
          if (value.diesel != ' ') {
            sumi = parseFloat(sumi) + parseFloat(value.diesel);
          }
          hora = hora + parseFloat(value.habiles);
        });
        this.elAprovechamiento = (parseFloat(sumi) / parseFloat(hora)).toFixed(2);
        return (parseFloat(sumi) / parseFloat(hora)).toFixed(2);
      }, topCalcParams: { precision: 2 }
    },
    { title: 'Numero de Parte', field: 'codigo', width: 100 },

    { title: 'Proyecto', field: 'proyecto', width: 200 },
    { title: 'H. Actual', field: 'horometroantiguo', width: 80, bottomCalc: 'sum', bottomCalcParams: { precision: 2 } },
    { title: 'H. Nuevo', field: 'horometronuevo', width: 80, bottomCalc: 'sum', bottomCalcParams: { precision: 2 } },
    {
      title: 'Habiles', field: 'habiles', bottomCalc: 'sum', bottomCalcParams: { precision: 2 }, formatter: 'money', formatterParams: {
        decimal: ',',
        thousand: '.',
        symbol: '',
        symbolAfter: 'p',
        precision: 2,
      }
    },
    { title: 'Nulas', field: 'nulas', bottomCalc: 'sum', bottomCalcParams: { precision: 2 } },
    { title: 'Metodo', field: 'metododepago' },
    { title: 'Gasolina', field: 'gasolina', bottomCalc: 'sum', bottomCalcParams: { precision: 2 } },
    { title: 'Diesel', field: 'diesel', bottomCalc: 'sum', bottomCalcParams: { precision: 2 } },

    { title: 'Operador', field: 'operadormaquina' },

    { title: 'Observaciones', field: 'observaciones', bottomCalc: 'sum', bottomCalcParams: { precision: 2 } },

    { title: 'Dia', field: 'dia', bottomCalc: 'sum', bottomCalcParams: { precision: 2 } },
    { title: 'Traslado', field: 'traslado', bottomCalc: 'sum', bottomCalcParams: { precision: 2 } },
    { title: 'Km', field: 'km', bottomCalc: 'sum', bottomCalcParams: { precision: 2 } },
    { title: 'Otro', field: 'otro', bottomCalc: 'sum', bottomCalcParams: { precision: 2 } },
    { title: 'Basura', field: 'basura', bottomCalc: 'sum', bottomCalcParams: { precision: 2 } },
    { title: 'Descarte', field: 'descarte' },
    { title: 'Grava', field: 'grava' },
    { title: 'Ripio', field: 'ripio' },
    { title: 'Piedra', field: 'piedra' },
    { title: 'Arena', field: 'arena' },
    { title: 'Cubos', field: 'cubos', bottomCalc: 'sum', bottomCalcParams: { precision: 2 } },

  ]

  leafecto: boolean = true
  table_t: any
  numerodeayuda: any = 0
  elnombremaquina: any = ""
  lafechaaanalizar: any
  tabla1: boolean = true
  tabla2: boolean = false

  mispermitidos: any = {
    generarpartes: false,
    reportepartes: false,
    agregarcosto: false,
    vercosto: false,
    costodiesel: false,
    descuento: false,
    estadistica: false,
    reporte: false
  }





  maquinaseleccionada: any
  preciodemaquina: any = {}
  preciodiesel: any = {}
  partediariopersonal: any = {}
  selected = new FormControl(0);
  @ViewChild('lineChart', { static: true }) private chartRef;
  chart: any;

  ayuda: any
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  displayedColumns: string[] = ['semaforizacion', 'codigo', 'nombre', 'descripcion', 'horometro', 'hodometro', 'estado', 'status', 'ubicacion', 'acciones'];
  latabla: any = []
  bien: any = {}
  desde = new Date()
  hasta = new Date()
  unitaayuda: any = new Date()
  fechaactual = new Date()
  partediario: any = {
    nulas: 0,
    habiles: 0
  };
  unicoparte: any = []
  resumentodo: any = {
    alerta: 0,
    atencion: 0,
    tranquilos: 0
  }
  costosdebien: any = {}
  descuento: any = {}
  ee() {
    console.log(this.leafecto)
  }
  constructor(public api: PrincipalService, public dialog: MatDialog, private socket: Socket, private router: Router, private cookieService: CookieService) {

    /*this.socket.on('parteactualizado', (data) => {
      this.ngOnInit()

    });*/


  }

  nuevoParteDiario() {

    this.router.navigate(['parteDiario']);
  }


  adicionarParte() {
    var lospartes = []
    var coincidencias = 0
    var coincidencias2 = 0
    if (this.selectedItems1.length != 0) {

      this.api.saberLosPrecios({ proyecto: this.selectedItems1[0], bien: this.bien }).subscribe((respuesta) => {
        console.log(respuesta.json());
        this.listadePrecios = respuesta.json();
        this.listadePrecios.forEach(element => {
          if (element.tipo == this.partediario.metododepago) {
            coincidencias = 1
          }
        });

        if (coincidencias == 1) {


          var ee = this.unitaayuda.split('-')
          console.log(ee)

          this.fechaactual = new Date()
          this.fechaactual.setFullYear(parseInt(ee[0]))
          this.fechaactual.setMonth(parseInt(ee[1]) - 1)
          this.fechaactual.setDate(parseInt(ee[2]))

          console.log(this.fechaactual)
          if (this.partediario.nulas == null || this.partediario.nulas == " ") {
            this.partediario.nulas = 0
          }
          this.partediario.proyecto = this.selectedItems1[0].value
          this.partediario.proyectoName = this.selectedItems1[0].itemName
          var unito
          var docito
          if ((this.fechaactual.getMonth() + 1) < 10) { unito = '0' + (this.fechaactual.getMonth() + 1) } else {
            unito = this.fechaactual.getMonth() + 1
          }
          if (this.fechaactual.getDate() < 10) { docito = '0' + this.fechaactual.getDate() } else {
            docito = this.fechaactual.getDate()
          }
          /*if (this.bien.tipo == "horometro") {
            this.partediario.habiles = (parseFloat(this.partediario.horometronuevo) - parseFloat(this.partediario.horometroactual)) - parseFloat(this.partediario.nulas)
          } else {
            this.partediario.habiles = (parseFloat(this.partediario.hodometronuevo) - parseFloat(this.partediario.hodometroactual)) - parseFloat(this.partediario.nulas)
          }*/
          var envio = this.partediario
          envio.operador = this.cookieService.get('cokidemiproyecto')
          envio.fecha = this.fechaactual.getFullYear() + "-" + unito + "-" + docito
          envio.afecto = this.leafecto

          console.log(this.misPartes)
          this.misPartes.forEach(element => {


            var obd = JSON.parse(element)
            console.log(obd.fecha, envio.fecha)
            if (obd.fecha == envio.fecha && obd.proyecto == this.selectedItems1[0].value) {
              coincidencias2 = 1

            }

          });

          if (coincidencias2 == 1) {
            alert("Ingreso una fecha existente para este parte")
          } else {


            if (this.partediario.metododepago != undefined) {
              if (this.partediario.metododepago == 'ninguno') {
                alert('Seleccione un metodo de pago por favor!');
              } else {
                switch (this.partediario.metododepago) {
                  case 'hora':
                    if (this.partediario.habiles == undefined) {
                      alert('Cargar hora porfavor!');
                    } else {
                      this.misPartes.push(JSON.stringify(envio))
                      alert('Cargado con exito!');
                      this.partediario.horometroactual = envio.horometronuevo
                      this.partediario.horometronuevo = envio.horometronuevo
                      this.partediario.nulas = 0
                      this.partediario.habiles = 0
                      this.partediario.observaciones = ""
                    }

                    break;
                  case 'dia':
                    if (this.partediario.dia == undefined) {
                      alert('Cargar dia porfavor!');
                    } else {
                      this.misPartes.push(JSON.stringify(envio))
                      alert('Cargado con exito!');
                      this.partediario.horometroactual = envio.horometronuevo
                      this.partediario.horometronuevo = envio.horometronuevo
                      this.partediario.nulas = 0
                      this.partediario.habiles = 0
                      this.partediario.observaciones = ""
                    }

                    break;
                  case 'km':
                    if (this.partediario.km == undefined) {
                      alert('Cargar km porfavor!');
                    } else {
                      this.misPartes.push(JSON.stringify(envio))
                      alert('Cargado con exito!');
                      this.partediario.horometroactual = envio.horometronuevo
                      this.partediario.horometronuevo = envio.horometronuevo
                      this.partediario.nulas = 0
                      this.partediario.habiles = 0
                      this.partediario.observaciones = ""
                    }

                    break;
                  case 'otro':
                    if (this.partediario.otro == undefined) {
                      alert('Cargar otro porfavor!');
                    } else {
                      this.misPartes.push(JSON.stringify(envio))
                      alert('Cargado con exito!');
                      this.partediario.horometroactual = envio.horometronuevo
                      this.partediario.horometronuevo = envio.horometronuevo
                      this.partediario.nulas = 0
                      this.partediario.habiles = 0
                      this.partediario.observaciones = ""
                    }

                    break;
                  case 'cubo':
                    if (this.partediario.cubos == undefined) {
                      alert('Cargar cubos porfavor!');
                    } else {
                      this.misPartes.push(JSON.stringify(envio))
                      alert('Cargado con exito!');
                      this.partediario.horometroactual = envio.horometronuevo
                      this.partediario.horometronuevo = envio.horometronuevo
                      this.partediario.nulas = 0
                      this.partediario.habiles = 0
                      this.partediario.observaciones = ""
                    }
                    break;
                  case 'traslado':
                    if (this.partediario.traslado == undefined) {
                      alert('Cargar Traslado porfavor!');
                    } else {
                      this.misPartes.push(JSON.stringify(envio))
                      alert('Cargado con exito!');
                      this.partediario.horometroactual = envio.horometronuevo
                      this.partediario.horometronuevo = envio.horometronuevo
                      this.partediario.nulas = 0
                      this.partediario.habiles = 0
                      this.partediario.observaciones = ""
                    }
                    break;
                  default:
                    break;
                }
              }


            } else {
              alert('Cargar porfavor un metodo de pago!');
            }
          }


        } else {
          alert("Por favor cargue el metodo de pago")
        }


      });
    } else {
      alert("Por favor cargue el proyecto")
    }

    var coincidencias = 0





    console.log(this.misPartes)


  }

  guardarParte() {
    this.misPartes.forEach((element, index) => {
      this.misPartes[index] = JSON.parse(element)
    });
    $('#test-modal-5').modal('hide');
    this.router.navigate(['/partes_diario/nuevo'], { queryParams: { param: JSON.stringify(this.misPartes) } });
    console.log(this.misPartes)
  }

  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  itemsbienes = []




  dropdownListtitle = [];
  selectedItemstitle = [];
  dropdownSettingstitle = {};
  itemstitle = []




  onItemSelecttitle(item: any) {
    console.log(item);
    console.log(this.selectedItems);

  }
  OnItemDeSelecttitle(item: any) {
    console.log(item);
    console.log(this.selectedItems);

  }
  onSelectAlltitle(items: any) {
    console.log(items);

  }
  onDeSelectAlltitle(items: any) {
    console.log(items);

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



  dropdownList1 = [];
  selectedItems1 = [];
  dropdownSettings1 = {};
  itemsbienes1 = []

  onItemSelect1(item: any) {
    console.log(item);
    console.log(this.bien);
    this.api.saberLosPrecios({ proyecto: item, bien: this.bien }).subscribe((respuesta) => {
      console.log(respuesta);
      this.listadePrecios = respuesta.json();
    });
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






  es1() {
    console.log(this.selectedItems)
    this.chart.destroy()
    var aux2 = 0
    var aux = 0
    var fechas = []
    var bienes = []
    var all = []
    var datas = []
    var dataotro = []
    var nombres = []
    var c = []
    var x = {
      desde: this.desde.getFullYear() + "-" + (this.desde.getMonth() + 1) + "-" + this.desde.getDate(),
      hasta: this.hasta.getFullYear() + "-" + (this.hasta.getMonth() + 1) + "-" + this.hasta.getDate(),
      bienes: this.selectedItems
    }
    this.api.fechasentre(x).subscribe((data) => {

      var otro = data.json().sort(function (a, b) {
        if (a.fecha > b.fecha) {
          return 1;
        }
        if (a.fecha < b.fecha) {
          return -1;
        }
        // a must be equal to b
        return 0;
      });
      console.log(otro)
      for (var i = 0; i <= otro.length - 1; i++) {
        fechas.push(otro[i].fecha)
        bienes.push(otro[i].maquina._id)
        nombres.push(otro[i].maquina.nombre + " " + otro[i].maquina.descripcion)
      }
      var todosbienes = this.eliminateDuplicates(bienes)
      var todasfechas = this.eliminateDuplicates(fechas)
      var todosnombres = this.eliminateDuplicates(nombres)



      for (var xi = todosbienes.length - 1; xi >= 0; xi--) {
        dataotro = []
        aux2 = 0
        for (var xb = todasfechas.length - 1; xb >= 0; xb--) {
          aux = 0

          for (var xc = otro.length - 1; xc >= 0; xc--) {
            if (otro[xc].maquina.tipo == "horometro") {
              if (otro[xc].maquina._id == todosbienes[xi] && todasfechas[xb] == otro[xc].fecha) {
                dataotro.push(otro[xc].horometronuevo)
                aux = 1
                aux2 = otro[xc].horometronuevo
              }
            } else {
              if (otro[xc].maquina._id == todosbienes[xi] && todasfechas[xb] == otro[xc].fecha) {
                dataotro.push(otro[xc].hodometronuevo)
                aux = 1
                aux2 = otro[xc].hodometronuevo
              }
            }

          }
          if (aux == 0) {
            dataotro.push(aux2)
          }
        }
        c.push({
          label: todosnombres[xi],
          data: dataotro.reverse(),
          borderColor: this.get_rand_color(),
          fill: false
        })
      }









      this.chart = new Chart(this.chartRef.nativeElement, {
        type: 'line',
        data: {
          labels: todasfechas,
          datasets: c
        },
        options: {
          responsive: true,
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              }
            }]
          }
        }
      });

    })
  }



  get_rand_color() { var color = Math.floor(Math.random() * Math.pow(256, 3)).toString(16); while (color.length < 6) { color = "0" + color; } return "#" + color; }


  multiproyectos(x) {
    this.itemsbienes1 = []
    var y = {}

    for (var i = x.length - 1; i >= 0; i--) {
      y = {
        "id": i,
        "itemName": x[i].codigo + " " + x[i].nombre,
        "value": x[i]._id
      }
      this.itemsbienes1.push(y)
    }
    this.dropdownSettings1 = {
      singleSelection: true,
      text: "Selecciona el Proyecto",
      selectAllText: 'Elegir todos',
      unSelectAllText: 'Quitar todos',
      enableSearchFilter: true,
      classes: "myclass custom-class"
    };
  }
  multititle(x) {
    this.itemstitle = [];
    var y = {};

    for (var i = x.length - 1; i >= 0; i--) {
      y = {
        "id": i,
        "itemName": x[i].title,
        "value": x[i].title
      };
      this.itemstitle.push(y);
    }
    this.dropdownSettingstitle = {
      singleSelection: false,
      text: 'Selecciona para imprimir',
      selectAllText: 'Elegir todos',
      unSelectAllText: 'Quitar todos',
      enableSearchFilter: true,
      classes: 'myclass custom-class'
    };
  }

  multiselect(x) {
    this.itemsbienes = []
    var y = {}

    for (var i = x.length - 1; i >= 0; i--) {
      y = {
        "id": i,
        "itemName": x[i].nombre + " " + x[i].descripcion,
        "value": x[i]._id
      }
      this.itemsbienes.push(y)
    }
    this.dropdownSettings = {
      singleSelection: false,
      text: "Selecciona los Bienes",
      selectAllText: 'Elegir todos',
      unSelectAllText: 'Quitar todos',
      enableSearchFilter: true,
      classes: "myclass custom-class"
    };

  }



  resumenes() {
    this.api.partesresumen().subscribe((data) => {
      console.log(data)
      this.resumentodo.totalcompras = data.json().todos
      this.resumentodo.totalmes = data.json().dia
    })
    /*this.resumentodo={
    alerta:0,
    atencion:0,
    tranquilos:0
  }
    this.resumentodo.general=this.ayuda.length
    for (var i = this.ayuda.length - 1; i >= 0; i--) {
      if (this.ayuda[i].status=="alerta") {
        this.resumentodo.alerta=this.resumentodo.alerta+ 1
      }else if (this.ayuda[i].status=="atencion") {
        this.resumentodo.atencion=this.resumentodo.atencion+1
      }else if (this.ayuda[i].status=="tranquilos") {
        this.resumentodo.tranquilos=this.resumentodo.tranquilos+1
      }
    }*/
  }


  ngOnInit() {

    var x3 = {
      id: this.cookieService.get('cokidemiproyecto'),
      modulo: "Partes"
    }
    this.api.mispermisos(x3).subscribe((dataa) => {
      var expresion = dataa.json().botones

      for (var i = expresion.length - 1; i >= 0; i--) {
        if (expresion[i].nombre == "Generar Parte" && expresion[i].estado == true) {
          this.mispermitidos.generarpartes = true
        }
        if (expresion[i].nombre == "Reporte de Parte" && expresion[i].estado == true) {
          this.mispermitidos.reportepartes = true
        }
        if (expresion[i].nombre == "Agregar Costo" && expresion[i].estado == true) {
          this.mispermitidos.agregarcosto = true
        }
        if (expresion[i].nombre == "Ver Costo" && expresion[i].estado == true) {
          this.mispermitidos.vercosto = true
        }
        if (expresion[i].nombre == "Ver Costo Diesel" && expresion[i].estado == true) {
          this.mispermitidos.costodiesel = true
        }
        if (expresion[i].nombre == "Descuentos" && expresion[i].estado == true) {
          this.mispermitidos.descuento = true
        }
        if (expresion[i].nombre == "Estadisticas" && expresion[i].estado == true) {
          this.mispermitidos.estadistica = true
        }
        if (expresion[i].nombre == "Reportes" && expresion[i].estado == true) {
          this.mispermitidos.reporte = true
        }
      }

    })
    this.chart = new Chart(this.chartRef.nativeElement, {
      type: 'line',
      data: {
        labels: [],
        datasets: []
      },
      options: {
        responsive: true,
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });

    var x = {
      usu: this.cookieService.get('cokidemiproyecto')
    }
    this.api.proyectoslista().subscribe((data) => {
      this.multiproyectos(data.json())
    })
    this.api.bienesmios(x).subscribe((data) => {
      this.ayuda = data.json()
      this.multiselect(this.ayuda)

      for (var i = this.ayuda.length - 1; i >= 0; i--) {
        if (this.ayuda[i].tipo == "horometro") {
          if (parseFloat(this.ayuda[i].horometro) >= parseFloat(this.ayuda[i].proximo)) {
            this.ayuda[i].status = "alerta"
          } else if (parseFloat(this.ayuda[i].horometro) >= (parseFloat(this.ayuda[i].proximo) - parseFloat(this.ayuda[i].anticipacion))) {
            this.ayuda[i].status = "atencion"
          } else {
            this.ayuda[i].status = "tranquilos"
          }
        } else {
          if (parseFloat(this.ayuda[i].hodometro) >= parseFloat(this.ayuda[i].proximo)) {
            this.ayuda[i].status = "alerta"
          } else if (parseFloat(this.ayuda[i].hodometro) >= (parseFloat(this.ayuda[i].proximo) - parseFloat(this.ayuda[i].anticipacion))) {
            this.ayuda[i].status = "atencion"
          } else {
            this.ayuda[i].status = "tranquilos"
          }
        }


      }

      console.log(data.json())
      this.latabla = new MatTableDataSource(this.ayuda);
      this.latabla.paginator = this.paginator;
      this.latabla.sort = this.sort;
      this.resumenes()
    })
  }
  applyFilter(filterValue: string) {
    this.latabla.filter = filterValue.trim().toLowerCase();

    if (this.latabla.paginator) {
      this.latabla.paginator.firstPage();
    }
  }
  maquina(x) {
    this.misPartes = []

    if (this.selectedItems1.length != 0) {
      this.api.saberLosPrecios({ proyecto: this.selectedItems1[0], bien: this.bien }).subscribe((respuesta) => {
        console.log(respuesta);
        this.listadePrecios = respuesta.json();
      });
    }
    this.listadePrecios = [];
    this.partediario = {
      diesel: " ",
      dieselpagado: " ",
      aceitemotor: " ",
      grasa: " ",
      liquidofreno: " ",
      gasolina: " ",
      aceitehidraulico: " ",
      aceitetransmision: " ",
      filtroaceite: " ",
      filtrocombustible: " ",
      aguadestilada: " ",
      metododepago: undefined,
      nulas: 0,
      viajes: " ",
      operadormaquina: " ",
      cubos: " ",
      arena: " ",
      piedra: " ",
      ripio: " ",
      grava: " ",
      gravilla: " ",
      descarte: " ",
      basura: " ",
      dia: " ",
      codigo: " "
    }
    for (var i = x.encargado.length - 1; i >= 0; i--) {
      if (x.encargado[i]._id == this.cookieService.get('cokidemiproyecto')) {
        this.partediario.operador = x.encargado[i].nombre + " " + x.encargado[i].apaterno
      }
    }

    this.partediario.nombre = x.nombre + " " + x.descripcion
    this.partediario.horometroactual = x.horometro
    this.partediario.horometronuevo = x.horometro
    this.partediario.hodometroactual = x.hodometro
    this.partediario.hodometronuevo = x.hodometro
    this.partediario.observaciones = ""
    this.partediario.maquina = x._id

    this.bien = x
  }

  calcular() {
    console.log('calculando', this.bien);
    if (this.bien.tipo == "horometro") {
      console.log('entrando')
      console.log(this.partediario.horometronuevo, this.partediario.horometroactual, this.partediario.nulas)
      this.partediario.habiles = (parseFloat(this.partediario.horometronuevo) - parseFloat(this.partediario.horometroactual)) - parseFloat(this.partediario.nulas)
    } else {
      console.log('sal')
      this.partediario.habiles = (parseFloat(this.partediario.hodometronuevo) - parseFloat(this.partediario.hodometroactual)) - parseFloat(this.partediario.nulas)
    }
  }
  enviar() {
    console.log(this.unitaayuda)
    var ee = this.unitaayuda.split('-')
    console.log(ee)

    this.fechaactual = new Date()
    this.fechaactual.setFullYear(parseInt(ee[0]))
    this.fechaactual.setMonth(parseInt(ee[1]) - 1)
    this.fechaactual.setDate(parseInt(ee[2]))



    console.log(this.fechaactual)
    if (this.partediario.nulas == null || this.partediario.nulas == " ") {
      this.partediario.nulas = 0
    }
    this.partediario.proyecto = this.selectedItems1[0].value
    var unito
    var docito
    if ((this.fechaactual.getMonth() + 1) < 10) { unito = '0' + (this.fechaactual.getMonth() + 1) } else {
      unito = this.fechaactual.getMonth() + 1
    }
    if (this.fechaactual.getDate() < 10) { docito = '0' + this.fechaactual.getDate() } else {
      docito = this.fechaactual.getDate()
    }
    /*if (this.bien.tipo == "horometro") {
      this.partediario.habiles = (parseFloat(this.partediario.horometronuevo) - parseFloat(this.partediario.horometroactual)) - parseFloat(this.partediario.nulas)
    } else {
      this.partediario.habiles = (parseFloat(this.partediario.hodometronuevo) - parseFloat(this.partediario.hodometroactual)) - parseFloat(this.partediario.nulas)
    }*/
    var envio = this.partediario
    envio.operador = this.cookieService.get('cokidemiproyecto')
    envio.fecha = this.fechaactual.getFullYear() + "-" + unito + "-" + docito
    envio.afecto = this.leafecto
    console.log(envio)
    console.log(this.partediario.metododepago);
    if (this.partediario.metododepago != undefined) {

      if (this.selectedItems1.length != 0) {
        this.api.saberLosPrecios({ proyecto: this.selectedItems1[0], bien: this.bien }).subscribe((respuesta) => {
          console.log(respuesta);
          var coincidencias = 0
          var money = respuesta.json();

          money.forEach(element => {
            if (element.tipo == this.partediario.metododepago) {
              coincidencias = 1
            }
          });

          if (coincidencias == 1) {
            if (this.partediario.metododepago == 'ninguno') {
              alert('Seleccione un metodo de pago por favor!');
            } else {
              switch (this.partediario.metododepago) {
                case 'hora':
                  if (this.partediario.habiles == undefined) {
                    alert('Cargar hora porfavor!');
                  } else {
                    this.api.todo(envio).subscribe((data) => {
                      console.log(data)
                      if (data.json().mensaje == 'yamantenimiento') {
                        alert('El bien se encuentra en mantenimiento! ...por favor intente nuevamente!');

                      } else if (data.json().mensaje == 'yaexiste') {
                        alert('Ya existe un parte con esa fecha! ...por favor revise!');

                      } else {
                        this.ngOnInit();
                        this.partediario = {
                          nulas: 0,
                          habiles: 0
                        };
                        $('#test-modal-5').modal('hide');
                        this.socket.emit('partenuevo', { mensaje: 'aprobada' });
                        alert('Gracias se cargo correctamente!');
                      }

                    });
                  }

                  break;
                case 'dia':
                  if (this.partediario.dia == undefined) {
                    alert('Cargar dia porfavor!');
                  } else {
                    this.api.todo(envio).subscribe((data) => {
                      console.log(data)
                      if (data.json().mensaje == 'yamantenimiento') {
                        alert('El bien se encuentra en mantenimiento!, ...por favor intente nuevamente!');

                      } else if (data.json().mensaje == 'yaexiste') {
                        alert('Ya existe un parte con esa fecha!, ...por favor revise!');

                      } else {
                        this.ngOnInit()
                        this.partediario = {
                          nulas: 0,
                          habiles: 0
                        };
                        $('#test-modal-5').modal('hide');
                        this.socket.emit('partenuevo', { mensaje: 'aprobada' });
                        alert('Gracias se cargo correctamente!');
                      }

                    });
                  }

                  break;
                case 'km':
                  if (this.partediario.km == undefined) {
                    alert('Cargar km porfavor!');
                  } else {
                    this.api.todo(envio).subscribe((data) => {
                      console.log(data)
                      if (data.json().mensaje == 'yamantenimiento') {
                        alert('El bien se encuentra en mantenimiento!, ...por favor intente nuevamente!');

                      } else if (data.json().mensaje == 'yaexiste') {
                        alert('Ya existe un parte con esa fecha!, ...por favor revise!');

                      } else {
                        this.ngOnInit()
                        this.partediario = {
                          nulas: 0,
                          habiles: 0
                        };
                        $('#test-modal-5').modal('hide');
                        this.socket.emit('partenuevo', { mensaje: 'aprobada' });
                        alert('Gracias se cargo correctamente!');
                      }

                    });
                  }

                  break;
                case 'otro':
                  if (this.partediario.otro == undefined) {
                    alert('Cargar otro porfavor!');
                  } else {
                    this.api.todo(envio).subscribe((data) => {
                      console.log(data)
                      if (data.json().mensaje == 'yamantenimiento') {
                        alert('El bien se encuentra en mantenimiento!, ...por favor intente nuevamente!');

                      } else if (data.json().mensaje == 'yaexiste') {
                        alert('Ya existe un parte con esa fecha!, ...por favor revise!');

                      } else {
                        this.ngOnInit()
                        this.partediario = {
                          nulas: 0,
                          habiles: 0
                        };
                        $('#test-modal-5').modal('hide');
                        this.socket.emit('partenuevo', { mensaje: 'aprobada' });
                        alert('Gracias se cargo correctamente!');
                      }

                    });
                  }

                  break;
                case 'cubo':
                  if (this.partediario.cubos == undefined) {
                    alert('Cargar cubos porfavor!');
                  } else {
                    this.api.todo(envio).subscribe((data) => {
                      console.log(data)
                      if (data.json().mensaje == 'yamantenimiento') {
                        alert('El bien se encuentra en mantenimiento! ...por favor intente nuevamente!');

                      } else if (data.json().mensaje == 'yaexiste') {
                        alert('Ya existe un parte con esa fecha!, ...por favor revise!');

                      } else {
                        this.ngOnInit()
                        this.partediario = {
                          nulas: 0,
                          habiles: 0
                        };
                        $('#test-modal-5').modal('hide');
                        this.socket.emit('partenuevo', { mensaje: 'aprobada' });
                        alert('Gracias se cargo correctamente!');
                      }

                    });
                  }
                  break;
                case 'traslado':
                  if (this.partediario.traslado == undefined) {
                    alert('Cargar Traslado porfavor!');
                  } else {
                    this.api.todo(envio).subscribe((data) => {
                      console.log(data)
                      if (data.json().mensaje == 'yamantenimiento') {
                        alert('El bien se encuentra en mantenimiento!, ...por favor intente nuevamente!');

                      } else if (data.json().mensaje == 'yaexiste') {
                        alert('Ya existe un parte con esa fecha!, ...por favor revise!');

                      } else {
                        this.ngOnInit()
                        this.partediario = {
                          nulas: 0,
                          habiles: 0
                        };
                        $('#test-modal-5').modal('hide');
                        this.socket.emit('partenuevo', { mensaje: 'aprobada' });
                        alert('Gracias se cargo correctamente!');
                      }

                    });
                  }
                  break;
                default:
                  break;
              }
            }

          } else {
            alert("Metodo de pago invalido")
          }
        });
      }



    } else {
      alert('Cargar porfavor un metodo de pago!');
    }

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




  partepersonal(x) {
    console.log(x);
    this.elnombremaquina = x.nombre + ' ' + x.descripcion;
    $('#tablita').dataTable().fnDestroy();

    this.partediariopersonal = {
      proyecto: ''
    };
    this.maquinaseleccionada = x;
    this.unicoparte = [];
    var ayuda = '';
    var otro: any = {};
    this.selected.setValue(2);
    var y = {
      maquina: x._id
    };
    var verificacion: any = {};
    this.api.parteunico(y).subscribe((data) => {
      console.log(data.json());
      var arreglo = data.json();
      for (var i = arreglo.length - 1; i >= 0; i--) {
        if (arreglo[i].diesel == undefined) {
          verificacion.diesel = false;
        } else {
          verificacion.diesel = true;
        }
        if (arreglo[i].cubos == undefined) {
          verificacion.cubos = false;
        } else {
          verificacion.cubos = true;
        }
        if (arreglo[i].viajes == undefined) {
          verificacion.viajes = false;
        } else {
          verificacion.viajes = true;
        }
        if (arreglo[i].material == undefined) {
          verificacion.material = false;
        } else {
          verificacion.material = true;
        }
        if (arreglo[i].operadormaquina == undefined) {
          verificacion.operadormaquina = false;
        } else {
          verificacion.operadormaquina = true;
        }
        if (arreglo[i].aceitemotor == undefined) {
          verificacion.aceitemotor = false;
        } else {
          verificacion.aceitemotor = true;
        }
        if (arreglo[i].grasa == undefined) {
          verificacion.grasa = false;
        } else {
          verificacion.grasa = true;
        }
        if (arreglo[i].liquidofreno == undefined) {
          verificacion.liquidofreno = false;
        } else {
          verificacion.liquidofreno = true;
        }
        if (arreglo[i].gasolina == undefined) {
          verificacion.gasolina = false;
        } else {
          verificacion.gasolina = true;
        }
        if (arreglo[i].aceitehidraulico == undefined) {
          verificacion.aceitehidraulico = false;
        } else {
          verificacion.aceitehidraulico = true;
        }
        if (arreglo[i].aceitetransmision == undefined) {
          verificacion.aceitetransmision = false;
        } else {
          verificacion.aceitetransmision = true;
        }
        if (arreglo[i].filtroaceite == undefined) {
          verificacion.filtroaceite = false;
        } else {
          verificacion.filtroaceite = true;
        }
        if (arreglo[i].filtrocombustible == undefined) {
          verificacion.filtrocombustible = false;
        } else {
          verificacion.filtrocombustible = true;
        }
        if (arreglo[i].aguadestilada == undefined) {
          verificacion.aguadestilada = false;
        } else {
          verificacion.aguadestilada = true;
        }
        if (arreglo[i].metododepago == undefined) {
          verificacion.metododepago = 'Ninguno';
        } else {
        }
        if (arreglo[i].otro == undefined) {
          verificacion.otro = false;
        } else {
          verificacion.otro = true;
        }
        if (arreglo[i].km == undefined) {
          verificacion.km = false;
        } else {
          verificacion.km = true;
        }
        if (arreglo[i].traslado == undefined) {
          verificacion.traslado = false;
        } else {
          verificacion.traslado = true;
        }
        if (arreglo[i].operador == null) {
          arreglo[i].operador = {}
        };
        otro.nombreo = arreglo[i].operador.nombre + ' ' + arreglo[i].operador.apaterno;
        otro.horometroantiguo = arreglo[i].horometroactual;
        otro.horometronuevo = arreglo[i].horometronuevo;
        otro.hodometroantiguo = arreglo[i].hodometroactual;
        otro.hodometronuevo = arreglo[i].hodometronuevo;
        otro.observaciones = arreglo[i].observaciones;
        otro.fecha = arreglo[i].fecha;
        otro.nulas = arreglo[i].nulas;
        otro.habiles = arreglo[i].habiles;
        otro.id = arreglo[i]._id;
        otro.proyecto = arreglo[i].proyecto.nombre;
        otro.dia = arreglo[i].dia;
        otro.basura = arreglo[i].basura;
        otro.descarte = arreglo[i].descarte;
        otro.gravilla = arreglo[i].gravilla;
        otro.grava = arreglo[i].grava;
        otro.ripio = arreglo[i].ripio;
        otro.piedra = arreglo[i].piedra;
        otro.idproyecto = arreglo[i].proyecto._id;
        otro.arena = arreglo[i].arena;
        otro.cubos = arreglo[i].cubos;
        otro.km = arreglo[i].km;
        otro.traslado = arreglo[i].traslado;
        otro.otro = arreglo[i].otro;
        otro.gasolina = arreglo[i].gasolina;
        otro.metododepago = arreglo[i].metododepago;

        otro.operadormaquina = arreglo[i].operadormaquina;
        otro.viajes = arreglo[i].viajes;
        otro.aguadestilada = arreglo[i].aguadestilada;
        otro.filtrocombustible = arreglo[i].filtrocombustible;
        otro.filtroaceite = arreglo[i].filtroaceite;
        otro.aceitetransmision = arreglo[i].aceitetransmision;
        otro.diesel = arreglo[i].diesel;
        otro.codigo = arreglo[i].codigo;










        /* $.each( verificacion, function( key, value ) {
           if (value==true) {
             otro.observaciones=eval("otro.observaciones +' '+key+':'+ arreglo[i]."+key)
           }
         });*/
        this.unicoparte.push(JSON.stringify(otro));
      }
      for (var ii = this.unicoparte.length - 1; ii >= 0; ii--) {
        this.unicoparte[ii] = JSON.parse(this.unicoparte[ii]);
      }
      console.log(this.unicoparte);
      this.verpar();




    });

  }
  alla() {
    if (this.tabla1 == true) {
      this.tabla1 = false
      this.tabla2 = true

      $("#tablita").css('display', 'none')
      $("#example-table-tabulator").css('display', 'block')
      $(".ee").css('display', 'initial')
    } else {
      this.tabla1 = true
      this.tabla2 = false
      $("#example-table-tabulator").css('display', 'none')
      $(".ee").css('display', 'none')

      $("#datatabless").css('display', 'block')
      $("#tablita").css('display', 'block')
    }
  }
  secambio() {
    console.log(this.seleccion)
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
  verpar() {
    this.losnoprint = [];
    var o = [];
    for (var i = this.miconte.length - 1; i >= 0; i--) {
      o.push(this.miconte[i].field);
    }
    this.losprint = o;

    this.multititle(this.miconte);




    this.table_t = new Tabulator('#example-table-tabulator', {
      data: this.unicoparte, // set initial table data

      printAsHtml: true,
      printCopyStyle: true,
      pagination: 'local',
      paginationSize: 50,
      paginationSizeSelector: [10, 50, 100, 200],
      movableColumns: true,

      selectable: 1,
      printHeader: `<h1 style="text-aling:center">Gastos</h1><h2>${this.maquinaseleccionada.nombre}</h2>`,

      printConfig: {
        columnGroups: true, // do not include column groups in column headers for HTML table
        rowGroups: true, // do not include row groups in HTML table
        columnCalcs: true, // do not include column calcs in HTML table
      },
      columns: this.miconte,
      rowSelectionChanged: function (data, rows) {
        //update selected row counter on selection change


        if (data[0]) {
          console.log(data[0]);
          this.partediariopersonal = data[0];
          this.lafechaaanalizar = data[0].fecha;
          $('#test-modal-77').modal('show');
        }



        console.log(data);
      },
    });


    $('#print-table').on('click', () => {
      this.table_t.print(false, true);
    });
    $('#download-csv').click(() => {
      this.table_t.download('csv', 'data.csv');
    });

    // trigger download of data.json file

    // trigger download of data.xlsx file
    $('#download-xlsx').click(() => {
      this.table_t.download('xlsx', 'data.xlsx', { sheetName: 'My Data' });
    });

    //trigger download of data.pdf file
    $("#download-pdf").click(() => {
      this.table_t.download("pdf", "data.pdf", {
        orientation: "landscape", //set page orientation to portrait
        title: "Example Report", //add title to report
      });
    });




    // this.table_t=table_t



    $('#tablita').dataTable().fnDestroy();
    var events = $('#events');
    var codigo = $('#tablita').DataTable({
      select: true,
      lengthChange: true,
      dom: 'Bfrtip',
      buttons: [

        {
          extend: 'copy',
          text: 'Copiar',
          className: 'red',
          exportOptions: {
            columns: ':visible'
          }
        },

        {
          extend: 'pdf',
          text: 'PDF',
          className: 'red',
          exportOptions: {
            columns: ':visible'
          }
        },
        {
          extend: 'csv',
          text: 'CSV',
          className: 'orange',

        },
        {
          extend: 'excel',
          text: 'Excel',
          className: 'green',
          exportOptions: {
            columns: ':visible'
          }
        },
        {
          extend: 'print',
          text: 'Imprimir',
          className: 'icon',
          messageTop: this.elnombremaquina,
          exportOptions: {
            columns: ':visible'
          },

        },
        {
          extend: 'colvis',
          text: 'Ordenar',
          className: 'green'
        }
      ],
      responsive: true,
      data: this.unicoparte,
      columns: [
        { data: 'id', visible: false },
        { data: 'proyecto' },
        { data: 'nombreo' },
        { data: 'fecha' },
        { data: 'horometroantiguo' },
        { data: 'horometronuevo' },
        { data: 'observaciones' },
        { data: 'codigo' },
        { data: 'nulas' },

        { data: 'habiles' },
        { data: 'dia' },
        { data: 'basura' },
        { data: 'descarte' },
        { data: 'gravilla' },
        { data: 'grava' },
        { data: 'ripio' },
        { data: 'piedra' },
        { data: 'arena' },
        { data: 'cubos' },
        { data: 'operadormaquina' },
        { data: 'viajes' },
        { data: 'aguadestilada' },
        { data: 'filtrocombustible' },
        { data: 'filtroaceite' },
        { data: 'aceitetransmision' },
        { data: 'diesel' }



      ]

    });


    if (this.numerodeayuda == 0) {

      codigo
        .on('select', (e, dt, type, indexes) => {
          $('#test-modal-77').modal('show');

          var rowData = codigo.rows(indexes).data().toArray();

          this.partediariopersonal = rowData[0]
          this.lafechaaanalizar = rowData[0].fecha
          console.log(rowData[0])

        })

      codigo.buttons().container()
        .appendTo('#example_wrapper .col-md-6:eq(0)');
    }

    this.numerodeayuda = this.numerodeayuda + 1




    $("#tablita").css('display', 'none')
    $("#datatabless").css('display', 'none')
  }
  cambiolafecha() {

    console.log(this.partediariopersonal.fecha)
  }
  editardiario() {
    console.log(this.partediariopersonal);
    var o = 0
    if (this.partediariopersonal.fecha == this.lafechaaanalizar) {
      o = 1
    }
    var x = {
      horometronuevo: this.partediariopersonal.horometronuevo,
      hodometronuevo: this.partediariopersonal.hodometronuevo,
      nulas: this.partediariopersonal.nulas,
      habiles: this.partediariopersonal.habiles,
      parte: this.partediariopersonal.id,
      operadormaquina: this.partediariopersonal.operadormaquina,
      observaciones: this.partediariopersonal.observaciones,
      fecha: this.partediariopersonal.fecha,
      dia: this.partediariopersonal.dia,
      basura: this.partediariopersonal.basura,
      descarte: this.partediariopersonal.descarte,
      gravilla: this.partediariopersonal.gravilla,
      grava: this.partediariopersonal.grava,
      gasolina: this.partediariopersonal.gasolina,
      ripio: this.partediariopersonal.ripio,
      piedra: this.partediariopersonal.piedra,
      arena: this.partediariopersonal.arena,
      cubos: this.partediariopersonal.cubos,
      viajes: this.partediariopersonal.viajes,
      diesel: this.partediariopersonal.diesel,
      dieselpagado: this.partediariopersonal.dieselpagado,
      codigo: this.partediariopersonal.codigo,
      maquina: this.maquinaseleccionada._id,
      idproyecto: this.partediariopersonal.idproyecto,
      sifecha: o
    }
    this.api.editarunparte(x).subscribe((data) => {
      if (data.json().mensaje == "yaexiste") {
        alert("Ya existe un parte con esa fecha!, ...por favor revise!");

      } else {
        this.partepersonal(this.maquinaseleccionada)
        $("#test-modal-77").modal('hide');
        alert("Se hizo el cambio con exito!, ..gracias!");
      }

    })
    console.log(this.partediariopersonal)


  }
  agregarcosto(x) {
    this.costosdebien.idbien = x._id
    this.costosdebien.bien = x.nombre + " " + x.descripcion

  }
  agregarunprecio() {
    if (this.costosdebien.tipo == 'diesel' || this.costosdebien.tipo == 'gasolina') {
      this.api.agregarunprecioaundiesel(this.costosdebien).subscribe((data) => {
        if (data.json().mensaje == 'encontrado') {
          alert('Ya existe costo para este proyecto!, ...por favor revise!');
        } else {
          alert('Gracias se cargo correctamente!');
        }
      })
    } else {
      this.api.agregarunprecioaunbien(this.costosdebien).subscribe((data) => {
        if (data.json().mensaje == 'encontrado') {
          alert('Ya existe costo para este proyecto de este tipo!, ...por favor revise!');
        } else {
          alert('Gracias se cargo correctamente!');
        }
      })
    }

    console.log(this.costosdebien)
  }
  vercosto(x) {

    $('#tablita1').dataTable().fnDestroy();
    var listadedatos: any
    this.api.vercostos(x).subscribe((data) => {
      listadedatos = data.json()
      console.log(data.json())

      $('#tablita1').dataTable().fnDestroy();
      var events = $('#events');
      var codigo = $('#tablita1').DataTable({
        select: true,
        lengthChange: true,

        responsive: true,
        data: listadedatos,
        columns: [
          { data: '_id', visible: false },
          { data: 'proyecto', visible: false },
          { data: 'proyecto.nombre' },
          { data: 'moneda' },
          { data: 'precio' },
          { data: 'tipo' },




        ]
      });
      codigo
        .on('select', (e, dt, type, indexes) => {


          var rowData = codigo.rows(indexes).data().toArray();
          this.preciodemaquina = rowData[0]



        })

      codigo.buttons().container()
        .appendTo('#example_wrapper .col-md-6:eq(0)');



    })


  }
  descuentos(x) {
    this.descuento = x
  }
  agregarundescuento() {
    console.log(this.descuento)
    this.api.descuento(this.descuento).subscribe((data) => {
      $("#test-modal-67").modal('hide')
      alert("Gracias se cargo correctamente!");
    })
  }
  vercostodiesel(x) {

    $('#tablita2').dataTable().fnDestroy();
    var listadedatos: any
    this.api.vercostosdiesel(x).subscribe((data) => {
      listadedatos = data.json()
      console.log(data.json())

      $('#tablita2').dataTable().fnDestroy();
      var events = $('#events');
      var codigo = $('#tablita2').DataTable({
        select: true,
        lengthChange: true,

        responsive: true,
        data: listadedatos,
        columns: [
          { data: '_id', visible: false },
          { data: 'proyecto', visible: false },
          { data: 'proyecto.nombre' },
          { data: 'moneda' },
          { data: 'precio' },
          { data: 'tipo' },




        ]
      });
      codigo
        .on('select', (e, dt, type, indexes) => {


          var rowData = codigo.rows(indexes).data().toArray();
          this.preciodiesel = rowData[0]



        })

      codigo.buttons().container()
        .appendTo('#example_wrapper .col-md-6:eq(0)');



    })


  }
  hacercambioprecio() {

    var x = { _id: this.preciodemaquina.bien }
    this.api.cambiarprecioproyecto(this.preciodemaquina).subscribe((data) => {
      this.vercosto(x)
    })
  }
  hacercambiopreciodiesel() {

    var x = { _id: this.preciodiesel.bien }
    this.api.cambiarpreciodiesel(this.preciodiesel).subscribe((data) => {
      this.vercostodiesel(x)
    })
  }
  customFilter(data) {
    return data.car && data.rating < 3;
  }

  updateFilter() {

    var filter = $("#filter-field").val() == "function" ? this.customFilter : $("#filter-field").val();

    if ($("#filter-field").val() == "function") {
      $("#filter-type").prop("disabled", true);
      $("#filter-value").prop("disabled", true);
    } else {
      $("#filter-type").prop("disabled", false);
      $("#filter-value").prop("disabled", false);
    }

    this.table_t.setFilter(filter, $("#filter-type").val(), $("#filter-value").val());
  }
  limpieza() {
    $("#filter-field").val("");
    $("#filter-type").val("=");
    $("#filter-value").val("");

    this.table_t.clearFilter();
  }
  nuevoIngreso(x) {
    console.log(x);
    const dialogRef = this.dialog.open(NuevoIngresoComponent, {
      width: '70%',
      height: '80%',
      data: {
        nuevo: true,
        bien: x,
      },
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

      }
    });
  }

  reportecompraq() {
    var t = []
    var x = {
      desde: this.desde1.getFullYear() + '-' + ('0' + (this.desde1.getMonth() + 1)).slice(-2) +
        '-' + ('0' + this.desde1.getDate()).slice(-2),
      hasta: this.hasta1.getFullYear() + '-' + ('0' + (this.hasta1.getMonth() + 1)).slice(-2) +
        '-' + ('0' + this.hasta1.getDate()).slice(-2),
      maquina: this.maquinaseleccionada

    }
    console.log(x)
    console.log(this.unicoparte)
    for (var i = this.unicoparte.length - 1; i >= 0; i--) {
      if (this.unicoparte[i].fecha >= x.desde && this.unicoparte[i].fecha <= x.hasta) {
        t.push(this.unicoparte[i])
      }
    }



    this.table_t.replaceData(t)
  }

  armarPdf() {
    console.log(this.maquinaseleccionada);
    console.log(this.unicoparte);
    const cabeza = ['Fecha', 'Numero', 'Proyecto', 'Horometro Inicial', 'Horometro Final', 'Horas', 'Nulas', 'Kms', ' Traslado', 'Cubos', 'Otro', 'Operador'];
    const cuerpo = [];
    for (let index = 0; index < this.unicoparte.length; index++) {
      const dedo = [];
      dedo.push(this.unicoparte[index].fecha);
      dedo.push(this.unicoparte[index].codigo);
      dedo.push(this.unicoparte[index].proyecto);
      dedo.push(this.unicoparte[index].horometroantiguo);
      dedo.push(this.unicoparte[index].horometroactual);
      dedo.push(this.unicoparte[index].habiles);
      dedo.push(this.unicoparte[index].nulas);
      dedo.push(this.unicoparte[index].km);
      dedo.push(this.unicoparte[index].traslado);
      dedo.push(this.unicoparte[index].cubos);
      dedo.push(this.unicoparte[index].otro);
      dedo.push(this.unicoparte[index].operadormaquina);
      cuerpo.push(dedo);

    }



    const doc = new jsPDF({
      orientation: 'landscape',
    });
    doc.text(String(this.maquinaseleccionada.codigo).toUpperCase() + ' ' + String(this.maquinaseleccionada.nombre).toUpperCase() +
      ' ' + String(this.maquinaseleccionada.descripcion).toUpperCase(), 100, 10);
    doc.setFontSize(16);

    doc.autoTable({
      head: [cabeza],
      body: cuerpo,
    })
    doc.save('a4.pdf');

  }


}