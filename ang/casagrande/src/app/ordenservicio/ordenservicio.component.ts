import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PrincipalService } from '../servicio/principal.service'
import { FormControl } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';

declare var $: any
declare var swal: any
declare var Swal: any
declare var XLSX: any

@Component({
  selector: 'app-ordenservicio',
  templateUrl: './ordenservicio.component.html',
  styleUrls: ['./ordenservicio.component.css']
})
export class OrdenservicioComponent implements OnInit {
  paraim: any = {
    lista: [],
    maquina: {},
    proyecto: {}
  }
  observaparag: any
  maqactu: any
  motivorechazo: any
  informe: boolean = true
  rechazo: boolean = false
  falla: any = {}
  fallas: any
  listafallas: any = [];






  mispermitidos: any = {
    generarorden: false,
    reporteorden: false,
    cerrarorden: false
  }



  selected = new FormControl(0);
  auxiliar: number = 0
  ayuda: any
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  displayedColumns: string[] = ['semaforizacion', 'codigo', 'nombre', 'descripcion', 'horometro', 'hodometro', 'estado', 'status', 'ubicacion', 'acciones'];
  latabla: any = []
  bien: any = {}
  fechaactual = new Date()
  fechaconclusion = new Date()
  orden: any = {}
  concluir: any = {}
  editField: string;
  kits: Array<any> = [{
    pieza: "",
    cantidad: 0,
    costo: 0,
    unidad: ""
  }]
  archivo: any
  ordenespecial: any
  visualizar: boolean = false
  repuni: any
  codice: any
  filaseleccionada: any = {
    kit: []
  }
  prevencionnueva: any = {}
  elbienseleccionado: any
  lasprevenciones: any
  resumentodo: any = {}




  dropdownList1 = [];
  selectedItems1 = [];
  dropdownSettings1 = {};
  itemsbienes1 = []
  constructor(public api: PrincipalService, private router: Router, private cookieService: CookieService) { }

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
      singleSelection: false,
      text: "Selecciona los Proyectos",
      selectAllText: 'Elegir todos',
      unSelectAllText: 'Quitar todos',
      enableSearchFilter: true,
      classes: "myclass custom-class"
    };
  }
  ngOnInit() {
    this.api.informacionfiltrada().subscribe((data) => {
      console.log(data.json())
      this.multiproyectos(data.json().proyectos)

    })
    var x2 = {
      id: this.cookieService.get('cokidemiproyecto'),
      modulo: "OD"
    }




    this.api.mispermisos(x2).subscribe((dataa) => {
      var expresion = dataa.json().botones
      for (var i = expresion.length - 1; i >= 0; i--) {
        if (expresion[i].nombre == "Generar OD" && expresion[i].estado == true) {
          this.mispermitidos.generarorden = true
        }
        if (expresion[i].nombre == "Reporte OD" && expresion[i].estado == true) {
          this.mispermitidos.reporteorden = true
        }
        if (expresion[i].nombre == "Cerrar OD" && expresion[i].estado == true) {
          this.mispermitidos.cerrarorden = true
        }
        if (expresion[i].nombre == "Aprobar OD" && expresion[i].estado == true) {
          this.mispermitidos.aprobarorden = true
        }

      }



    })



    var x = {
      usu: this.cookieService.get('cokidemiproyecto')
    }
    this.api.bienesmios(x).subscribe((data) => {
      this.ayuda = data.json()
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
  resumenes() {
    this.resumentodo = {
      alerta: 0,
      atencion: 0,
      tranquilos: 0
    }
    this.resumentodo.general = this.ayuda.length
    for (var i = this.ayuda.length - 1; i >= 0; i--) {
      if (this.ayuda[i].status == "alerta") {
        this.resumentodo.alerta = this.resumentodo.alerta + 1
      } else if (this.ayuda[i].status == "atencion") {
        this.resumentodo.atencion = this.resumentodo.atencion + 1
      } else if (this.ayuda[i].status == "tranquilos") {
        this.resumentodo.tranquilos = this.resumentodo.tranquilos + 1
      }

    }
  }
  applyFilter(filterValue: string) {
    this.latabla.filter = filterValue.trim().toLowerCase();

    if (this.latabla.paginator) {
      this.latabla.paginator.firstPage();
    }
  }
  maquina(x) {
    this.informe = true
    this.rechazo = false
    this.orden = x
    this.orden.nombre = x.nombre + " " + x.descripcion
  }
  ordenes(x) {
    this.concluir.nombre = x.nombre + " " + x.descripcion

  }
  enviar() {
    var x = {
      mecanicoE: this.orden.mecanicoo,
      electricistaE: this.orden.electricista,
      soldadorE: this.orden.soldador,
      otroE: this.orden.otroo,
      fecha: this.fechaactual,
      maquina: this.orden._id,
      estado: "c_mantenimiento",
      fechasalida: "",
      observaciones: this.observaparag,
      tipo: "correctivo",
      viene: 'normal',
      pasa: false
    }
    this.api.enviarorden(x).subscribe((data) => {
      console.log(data)
      if (data.json().mensaje == "ya esta") {
        alert('El equipo ya esta en mantenimiento')
        

      } else {
        this.ngOnInit()
        $('#test-modal-5').modal('hide');

        alert("Gracias se cargo correctamente!");
      }

    })
    console.log(this.orden)
  }
  reporteunico(row) {


    this.repuni = []


    this.selected.setValue(1)
    this.visualizar = true
    var x = {
      maquina: row._id
    }

    this.api.ordenunica(x).subscribe((data) => {
      this.repuni = data.json()

      this.verpar()

    })
  }
  verpar() {
    $('#tablita').dataTable().fnDestroy();
    var codigotabla = $('#tablita123').DataTable({
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
          exportOptions: {
            columns: ':visible'
          }
        },
        {
          extend: 'colvis',
          text: 'Ordenar',
          className: 'green'
        }
      ],
      responsive: true,
      data: this.repuni,
      select: true,
      order: [[1, 'asc']],
      columns: [

        { data: '_id' },
        { data: 'fecha' },
        { data: 'estado' },
        { data: 'maquina.nombre' },
        { data: 'maquina.descripcion' },
        { data: 'fechasalida' },
        { data: 'observaciones' }


      ]
    });

    if (this.repuni.length >= 1) {
      codigotabla.on('select', (e, dt, type, indexes) => {
        var rowData = codigotabla.rows(indexes).data().toArray();
        console.log(rowData);
        this.filaseleccionada = rowData
      })




      codigotabla.buttons().container()
        .appendTo('#example_wrapper .col-md-6:eq(0)');
    }
  }
  verdetalle() {
    console.log(this.filaseleccionada)
    var x = []
    x = this.filaseleccionada.kit
    $("#fila").empty()
    x.forEach((ele) => {
      $('#fila').append('<tr>' +
        '<td>' + ele.pieza + '</td>' +
        '<td>' + ele.cantidad + '</td>' +
        '<td>' + ele.costo + '</td>' +
        '<td>' + ele.unidad + '</td>' +
        '</tr>')
    })




  }
  generarprevencion(x) {
    this.elbienseleccionado = x

  }
  enviarprevencion() {
    var xs = this.prevencionnueva
    xs.bien = this.elbienseleccionado

    this.api.guardarprevencion(xs).subscribe((data) => {
      this.prevencionnueva = {}
      $('#test-modal-756').modal('hide');
      alert("Gracias se cargo correctamente!");

    })
  }
  verprevencion(x) {
    this.api.verprevenciones(x).subscribe((data) => {
      this.lasprevenciones = data.json()
      console.log(data.json())
    })
  }
  fallasagregar() {
    this.listafallas.push(this.fallas);
  }
  quitar(x) {
    var index = this.listafallas.indexOf(x);
    if (index > -1) {
      this.listafallas.splice(index, 1);
    }
  }
  rechazarfallas() {
    this.informe = false
    this.rechazo = true
    this.motivorechazo = ""
  }
  fallasrechaza() {

  }
  soli(x) {
    this.router.navigate(['/sol_com/nueva_solicitud_lista/' + x._id]);
    console.log(x)
  }

  fallitas() {
    this.falla.lista = this.listafallas
    this.falla.maquina = this.orden._id
    this.falla.estado = "abierto"
    this.falla.motivo = ""
    this.falla.corregido = []
    this.falla.proyecto = this.selectedItems1[0].value
    console.log(this.falla)
    this.api.agregarfalla(this.falla).subscribe((data) => {
      console.log(data.json())
      alert("Gracias se cargo correctamente!");
      this.ngOnInit()
    })
  }
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
  imprimir(x) {
    console.log(x)
    var q = x
    this.api.buscarfallaq(q).subscribe((data) => {

      this.paraim = data.json()
      console.log(data.json())


    })
  }
  maquinafalla(x) {
    this.orden = x
    this.orden.nombre = x.nombre + " " + x.descripcion


    this.informe = true
    this.rechazo = false
    this.motivorechazo = ""
    this.api.buscarfalla(x).subscribe((data) => {
      console.log(data)
      this.maqactu = data.json()

      this.listafallas = data.json().lista
      this.falla = data.json()

    })
    console.log(x)

    this.listafallas = x.fallas
  }
  actualizarfalla() {
    var x = { lista: this.listafallas, maq: this.maqactu }
    this.api.actualizarfalla(x).subscribe((data) => {
      console.log(data.json())
      alert("Gracias se actualizo!");

      $("#test-modal-544").modal('hide')
    })
  }
  rechazado() {
    var x = { motivo: this.motivorechazo, maq: this.maqactu }
    this.api.rechazarfalla(x).subscribe((data) => {
      this.ngOnInit()
      alert("Informe de fallas rechazado!");
    })
  }
  god() {
    this.informe = false
  }
  autorizar(x) {
    console.log(x);
    var opcion = confirm("Esta seguro de habilitar?");
    if (opcion == true) {
      this.api.habiliarDiario(x).subscribe((respuesta) => {
        console.log(respuesta);
      })
    } else {

    }
   

  }

}
function format(d: any) {
  console.log(d)
  var x = ""
  // `d` is the original data object for the row
  for (var i = d.kit.length - 1; i >= 0; i--) {
    x = x + '<tr>' +
      '<td>' + d.kit[i].pieza + '</td>' +
      '<td>' + d.kit[i].cantidad + '</td>' +
      '<td>' + d.kit[i].costo + '</td>' +
      '<td>' + d.kit[i].unidad + '</td>' +
      '</tr>'
  }
  return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;width:100%;">' +
    '<tr style="background:#17223b;color:white;font-family: sans-serif;">' +
    '<th>Pieza</th>' +
    '<th>Cantidad</th>' +
    '<th>Costo</th>' +
    '<th>Unidad</th>' +
    '</tr>' + x +

    '</table>';
}
