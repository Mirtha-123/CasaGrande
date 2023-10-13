import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PrincipalService } from '../servicio/principal.service'
import { FormControl } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute } from '@angular/router';
import { Socket } from 'ngx-socket-io';

import { FileUploader } from 'ng2-file-upload';
import { SolicitudDetalComponent } from './solicitud-detal/solicitud-detal.component';
import { MatDialog } from '@angular/material';

declare var $: any
declare var swal: any
declare var Swal: any
declare var XLSX: any
declare var Tabulator: any

const URL = 'https://casagrande-erp.com/api/upload';
// const URL = 'http://167.99.230.192:3000/api/upload';
// const URL = 'http://localhost:3000/api/upload';
@Component({
  selector: 'app-solicitud',
  templateUrl: './solicitud.component.html',
  styleUrls: ['./solicitud.component.css']
})

export class SolicitudComponent implements OnInit {
  loading: any = false

  marcarTodos: any = false;
  solicitudEmpresion: any = {
    maquina: {},
    usuario: {}
  };
  solicitudImpresion: any = [];

  soyYo: any = false;

  color = 'primary';
  mode = 'determinate';
  value = 50;
  bufferValue = 75;





  correlativo: any = ""
  otratabla: any
  rece: any = {}
  lafoto: any
  lasfotos: any
  lamaquina: any
  fotito: any
  public hasBaseDropZoneOver: boolean = false;
  public hasAnotherDropZoneOver: boolean = false;

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }



  public uploader: FileUploader = new FileUploader({ url: URL, itemAlias: 'photo', maxFileSize: 10 * 1024 * 1024 });


  recepcion: any = {}


  siguientepasito1: boolean = true



  desde: any
  hasta: any
  desde3: any
  hasta3: any
  lanuevatabla: any




  mispermitidos: any = {
    generarsolicitud: false,
    aprobarsolicitud: false,
    vertodas: false
  }



  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  displayedColumns: string[] = ['proyecto', 'usuario', 'fecha', 'estado', 'maquinaria', 'acciones'];
  latabla: any = []
  grande: any

  contador: number = 1
  editField: string;
  kits: Array<any> = []
  archivo: any
  fechaactual = new Date()
  ayuda: any = []
  imagenes: any
  datos: any = {}
  observaciones_finales: any


  itemsbienes: any = []
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  es1() { }

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
  applyFilter(filterValue: string) {
    this.latabla.filter = filterValue.trim().toLowerCase();

    if (this.latabla.paginator) {
      this.latabla.paginator.firstPage();
    }
  }



  resumen: any = {
    count: 25,
    page: -1,
    large: 0
  }


  constructor(private route: ActivatedRoute, public dialog: MatDialog, private socket: Socket, public api: PrincipalService, private router: Router, private cookieService: CookieService) {

    this.socket.on('ver', (data) => {
      this.ngOnInit()

    });
    this.socket.on('otrasolicitud', (data) => {
      this.ngOnInit()

    });



  }


  spreadBackColor = 'aliceblue';
  sheetName = 'Goods List';
  hostStyle = {
    width: '700px',
    height: '400px'
  };
  data = [
    { Name: 'Apple', Category: 'Fruit', Price: 1, 'Shopping Place': 'Wal-Mart' },
    { Name: 'Potato', Category: 'Fruit', Price: 2.01, 'Shopping Place': 'Other' },
    { Name: 'Tomato', Category: 'Vegetable', Price: 3.21, 'Shopping Place': 'Other' },
    { Name: 'Sandwich', Category: 'Food', Price: 2, 'Shopping Place': 'Wal-Mart' },
    { Name: 'Hamburger', Category: 'Food', Price: 2, 'Shopping Place': 'Wal-Mart' },
    { Name: 'Grape', Category: 'Fruit', Price: 4, 'Shopping Place': 'Sun Store' }
  ];
  columnWidth = 100;

  /* workbookInit(args){
     let spread:GC.Spread.Sheets.Workbook = args.spread;
     let sheet =  spread.getActiveSheet();
     sheet.getCell(0,0).text("My SpreadJS Angular Project").foreColor("blue");
   }*/






  mandar(x) {
    this.lafoto = x
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
  solicitudesreportesma() {
    var x = {
      desde: this.desde3.getFullYear() + "-" + ("0" + (parseFloat(this.desde3.getMonth()) + 1)).slice(-2) + "-" + ("0" + this.desde3.getDate()).slice(-2),
      hasta: this.hasta3.getFullYear() + "-" + ("0" + (parseFloat(this.hasta3.getMonth()) + 1)).slice(-2) + "-" + ("0" + this.hasta3.getDate()).slice(-2),
      maq: this.itemsbienes
    }
    console.log(x);
    this.api.reportemaq(x).subscribe((data) => {
      console.log(data.json())

      var w = data.json()
      var u = []
      for (var i = w.length - 1; i >= 0; i--) {
        console.log(w[i].horaAprobacion)
        if (w[i].horaAprobacion != undefined) {
          var horaA: any = new Date(w[i].horaAprobacion);
        }
        if (w[i].horaCierre != undefined) {
          var horaC: any = new Date(w[i].horaCierre);
        }

        var tt = new Date(w[i].fecha)
        var r: any = {
          fecha: w[i].fecha,
          hora: w[i].hora,
          maquina: w[i].maquina.nombre + " " + w[i].maquina.descripcion,
          observaciones: w[i].observaciones,
          proyecto: w[i].proyecto.codigo + " " + w[i].proyecto.nombre,
          estado: w[i].estado,
          tipo: w[i].tipo,
          usuario: w[i].usuario.nombre + " " + w[i].usuario.apaterno,
          kit: w[i].kit
        }
        if (w[i].horaAprobacion != undefined) {
          r.horaAprobacion = horaA.getFullYear() + '-' + ("0" + (parseFloat(horaA.getMonth()) + 1)).slice(-2) + '-' + ("0" + horaA.getDate()).slice(-2) + ' ' + horaA.getHours() + ':' + horaA.getMinutes();
        }
        if (w[i].horaCierre != undefined) {
          r.horaCierre = horaC.getFullYear() + '-' + ("0" + (parseFloat(horaC.getMonth()) + 1)).slice(-2) + '-' + ("0" + horaC.getDate()).slice(-2) + ' ' + horaC.getHours() + ':' + horaC.getMinutes();
        }
        u.push(r)
      }
      this.lanuevatabla = new Tabulator("#verreporte1", {
        data: u,
        layout: "fitColumns",
        dataTree: true,
        rowDblClick: (e, row) => {
          console.log(row);
          row.select();
          console.log(row._row.data);
          this.mostrarDetalle(row._row.data);
        },
        selectable: 1,
        dataTreeChildField: "childRows",
        columns: [
          {
            title: "Fecha", field: "fecha", width: 100, "_children": [
              { id: 2, name: "Mary May", age: "1" }, //child rows nested under billy bob
              { id: 3, name: "Christine Lobowski", age: "42" },
              {
                id: 4, name: "Brendon Philips", age: "125", "_children": [
                  { id: 5, name: "Margret Marmajuke", age: "16" }, //child rows nested under brendon philps
                  { id: 6, name: "Frank Peoney", age: "12" },
                ]
              },
            ]
          },
          { title: "Hora", field: "hora", align: "center" },
          { title: "H/A", field: "horaAprobacion", align: "center" },
          { title: "H/C", field: "horaCierre", align: "center" },
          { title: "Maquina", field: "maquina", align: "right", },
          { title: "Observaciones", field: "observaciones", widthGrow: 2 },
          { title: "Proyecto", field: "proyecto", align: "center" },
          { title: "Estado", field: "estado", align: "center" },

          { title: "Solicitante", field: "usuario", align: "center" },
        ],
      });
    })

  }
  mostrarDetalle(x) {
    const dialogRef = this.dialog.open(SolicitudDetalComponent, {
      width: '70%',
      data: {
        bien: x,
      },
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

      }
    });
  }
  multiselect(x) {
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
  ngOnInit() {

    this.api.bienes().subscribe((data) => {
      this.multiselect(data.json())
    })
    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      console.log('ImageUpload:uploaded:', item, status, response);

      var x = JSON.parse(response)


      this.fotito = x.success.secure_url

      console.log(x)
      var p = {
        fotito: this.fotito,
        datos: this.lamaquina,

      }

      this.api.lafotito2(p).subscribe((data) => {
        this.lasfotos.push(x.success.secure_url)
        alert("Gracias se cargo correctamente!");
      })




    };
















    $(".photo").click(function () {
      var clickedClass = $(this).attr("class");
      var clickedStyle = $(this).attr("style");
      var stage = $('.gallery-roundup').find('.stage').attr("class");
      $('.gallery-roundup').find('.stage').attr("class", clickedClass);
      $(this).attr("class", stage).removeAttr("style");
    });

    var x2 = {
      id: this.cookieService.get('cokidemiproyecto'),
      modulo: "Solicitud"
    }
    this.resumen.id = this.cookieService.get('cokidemiproyecto')
    this.resumen.modulo = "Solicitud"

    this.api.mispermisos(x2).subscribe((dataa) => {
      var expresion = dataa.json().botones
      for (var i = expresion.length - 1; i >= 0; i--) {
        if (expresion[i].nombre == "Generar Solicitud" && expresion[i].estado == true) {
          this.mispermitidos.generarsolicitud = true
        }
        if (expresion[i].nombre == "Aprobar Solicitud" && expresion[i].estado == true) {
          this.mispermitidos.aprobarsolicitud = true
        }
        if (expresion[i].nombre == "Ver Todas las Solicitudes" && expresion[i].estado == true) {
          this.mispermitidos.vertodas = true



        } else {

        }

      }
      if (this.mispermitidos.vertodas == true) {
        this.api.listasolicitudes2(this.resumen).subscribe((data: any) => {
          console.log(data.json())
          this.resumen.page = data.json().page;
          // this.pageSize = response.pageSize;
          this.resumen.large = data.json().large;
          let ValueData: any = data.json().data

          this.ayuda = []
          for (var i = ValueData.length - 1; i >= 0; i--) {
            var x = {
              observaciones_nuevas: ValueData[i].observaciones_nuevas,
              solicitud: ValueData[i]._id,
              nombre: ValueData[i].nombre,
              idUsuario: ValueData[i].usuario._id,
              usuario: ValueData[i].usuario.nombre + " " + ValueData[i].usuario.apaterno,
              proyecto: ValueData[i].proyecto,
              fecha: ValueData[i].fecha,
              imgs: ValueData[i].imgs,
              observaciones: ValueData[i].observaciones,
              estado: ValueData[i].estado,
              maquina: ValueData[i].maquina._id,
              nombrema: ValueData[i].maquina.nombre + " " + ValueData[i].maquina.descripcion,
              ident: ValueData[i]._id,
              tipo: ValueData[i].tipo,
              kit: ValueData[i].kit,
            }
            this.ayuda.push(x)
          }
          this.latabla = new MatTableDataSource(this.ayuda);
          this.latabla.paginator = this.paginator;
          this.latabla.sort = this.sort;
        })
      } else {
        this.api.listasolicitudespersonales(this.resumen).subscribe((data: any) => {
          console.log(data.json())
          this.resumen.page = data.json().page;
          // this.pageSize = response.pageSize;
          this.resumen.large = data.json().large;
          let ValueData: any = data.json().data
          this.ayuda = []
          for (var i = ValueData.length - 1; i >= 0; i--) {
            var x = {
              observaciones_nuevas: ValueData[i].observaciones_nuevas,
              idUsuario: ValueData[i].usuario._id,
              solicitud: ValueData[i]._id,
              proyecto: ValueData[i].proyecto,
              fecha: ValueData[i].fecha,
              imgs: ValueData[i].imgs,
              usuario: ValueData[i].usuario.nombre + " " + ValueData[i].usuario.apaterno,
              observaciones: ValueData[i].observaciones,
              estado: ValueData[i].estado,
              maquina: ValueData[i].maquina._id,
              nombrema: ValueData[i].maquina.nombre + " " + ValueData[i].maquina.descripcion,
              ident: ValueData[i]._id,
              tipo: ValueData[i].tipo,
              kit: ValueData[i].kit,
            }
            this.ayuda.push(x);
          }
          this.latabla = new MatTableDataSource(this.ayuda);
          this.latabla.paginator = this.paginator;
          this.latabla.sort = this.sort;
        })
      }


    })





  }

  getServerData(x) {
    
    console.log(x)
    this.loading = true
    console.log(this.loading)
    this.resumen.id = this.cookieService.get('cokidemiproyecto')
    this.resumen.modulo = "Solicitud"
    this.resumen.count = x.pageSize
    this.resumen.page = x.pageIndex
    console.log(this.resumen)
    if (this.mispermitidos.vertodas == true) {
      this.api.listasolicitudes2(this.resumen).subscribe((data: any) => {
        this.loading= false
        console.log(data.json())
        this.resumen.page = data.json().page;
        // this.pageSize = response.pageSize;
        this.resumen.large = data.json().large;
        let ValueData: any = data.json().data

        this.ayuda = []
        for (var i = ValueData.length - 1; i >= 0; i--) {
          var x = {
            observaciones_nuevas: ValueData[i].observaciones_nuevas,
            solicitud: ValueData[i]._id,
            nombre: ValueData[i].nombre,
            idUsuario: ValueData[i].usuario._id,
            usuario: ValueData[i].usuario.nombre + " " + ValueData[i].usuario.apaterno,
            proyecto: ValueData[i].proyecto,
            fecha: ValueData[i].fecha,
            imgs: ValueData[i].imgs,
            observaciones: ValueData[i].observaciones,
            estado: ValueData[i].estado,
            maquina: ValueData[i].maquina._id,
            nombrema: ValueData[i].maquina.nombre + " " + ValueData[i].maquina.descripcion,
            ident: ValueData[i]._id,
            tipo: ValueData[i].tipo,
            kit: ValueData[i].kit,
          }
          this.ayuda.push(x)
        }
        this.latabla = new MatTableDataSource(this.ayuda);
        // this.latabla.paginator = this.paginator;
        this.latabla.sort = this.sort;
        
      })
    } else {
      this.api.listasolicitudespersonales(this.resumen).subscribe((data: any) => {
        console.log(data.json())
        this.loading= false
        this.resumen.page = data.page;
        // this.pageSize = response.pageSize;
        this.resumen.large = data.large;
        let ValueData: any = data.json().data
        this.ayuda = []
        for (var i = ValueData.length - 1; i >= 0; i--) {
          var x = {
            observaciones_nuevas: ValueData[i].observaciones_nuevas,
            idUsuario: ValueData[i].usuario._id,
            solicitud: ValueData[i]._id,
            proyecto: ValueData[i].proyecto,
            fecha: ValueData[i].fecha,
            imgs: ValueData[i].imgs,
            usuario: ValueData[i].usuario.nombre + " " + ValueData[i].usuario.apaterno,
            observaciones: ValueData[i].observaciones,
            estado: ValueData[i].estado,
            maquina: ValueData[i].maquina._id,
            nombrema: ValueData[i].maquina.nombre + " " + ValueData[i].maquina.descripcion,
            ident: ValueData[i]._id,
            tipo: ValueData[i].tipo,
            kit: ValueData[i].kit,
          }
          this.ayuda.push(x);
        }
        this.latabla = new MatTableDataSource(this.ayuda);
        // this.latabla.paginator = this.paginator;
        this.latabla.sort = this.sort;
        
      })
    }
  }

  correl() {
    var x = {
      nom: "notaentrega"
    }
    this.api.correlativo(x).subscribe((data) => {
      console.log(data.json())
      this.correlativo = data.json().codigo
    })
    this.api.solicitudID({ id: this.datos.solicitud }).subscribe((respuesta) => {
      if (respuesta) {
        if (respuesta.json().mecanico) {
          this.recepcion.mecanico = respuesta.json().mecanico;
        }
        console.log(respuesta.json());
      }
    });
  }
  imprimir1(x) {
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
  imprimir2(x) {
    console.log(x)
    switch (x) {
      case 1:
        this.otratabla.print(false, true);
        break;
      case 2:
        this.otratabla.download("csv", "data.csv");
        break;
      case 3:
        this.otratabla.download("json", "data.json");
        break;
      case 4:
        this.otratabla.download("xlsx", "data.xlsx", { sheetName: "My Data" });
        break;
      default:
        this.otratabla.download("pdf", "data.pdf", {
          orientation: "portrait", //set page orientation to portrait
          title: "Example Report", //add title to report
        });
        break;
    }

  }
  imprimir3(x) {
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
  solicitudesreportes() {
    var x = {
      desde: this.desde,
      hasta: this.hasta
    }
    this.api.solicitudreporte(x).subscribe((data) => {
      console.log(data.json())

      var lista = []
      var w = data.json()
      var u = []
      for (var i = w.length - 1; i >= 0; i--) {
        w[i].kit.forEach(element => {
          element.codigo = w[i].nombre + '-' + w[i].maquina.codigo + '-' + w[i].maquina.nombre + '-' + w[i].proyecto.codigo + ' ' + w[i].proyecto.nombre
          element.mecanico = w[i].mecanico
          element.pidio = w[i].usuario.nombre + ' ' + w[i].usuario.apaterno
          if (element.completo) {
            element.completo = 'Completado'
          } else {
            element.completo = 'Incompleto'
          }
          lista.push(element)
        });



        /*var tt = new Date(w[i].fecha)
        var r: any = {
          fecha: w[i].fecha,
          maquina: w[i].maquina.nombre + " " + w[i].maquina.descripcion,
          observaciones: w[i].observaciones,
          proyecto: w[i].proyecto.codigo + " " + w[i].proyecto.nombre,
          estado: w[i].estado,
          usuario: w[i].usuario.nombre + " " + w[i].usuario.apaterno
        }
        u.push(r)*/
      }
      console.log(lista)
      this.lanuevatabla = new Tabulator("#verreporte", {
        data: lista,
        layout: "fitColumns",
        groupBy: "codigo",
        columns: [
          { title: "Descripcion", field: "descripcion", width: 200 },
          { title: "Unidad", field: "unidad", align: "right", },
          { title: "Cantidad", field: "cantidad", widthGrow: 2 },
          { title: "Aprobado", field: "aprobado", align: "center" },
          { title: "Completado", field: "completo", align: "center" },
          { title: "Solicitante", field: "pidio", align: "center" }
        ],
      });



    })
  }
  nuevo() {
    this.router.navigate(['sol_com/nueva_solicitud']);
  }
  editar(row) {
    console.log('hago click', row)
    this.router.navigate(['sol_com/editar_solicitud_lista/' + row.solicitud]);
  }
  nuevalista() {
    this.router.navigate(['sol_com/nueva_solicitud_lista/simple']);
  }
  parcial() {
    var x = {
      informacion: this.datos,
      recepcion: this.recepcion
    }
    console.log(x);

    this.api.parciallista(x).subscribe((data) => {
      alert("Se finalizo con exito!");
      $('#test-modal-88').modal('hide');
      this.ngOnInit()
    });
  }
  ver1(x) {
    console.log(x)
    this.siguientepasito1 = true
    this.imagenes = x.imgs
    this.datos = x

    for (let index = 0; index < this.datos.kit.length; index++) {
      this.datos.kit[index].nCantidad = this.datos.kit[index].cantidad;
    }
    $('#tablita231').dataTable().fnDestroy();
    var events = $('#events');
    var codigo = $('#tablita231').DataTable({
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
      data: this.datos.kit,
      columns: [
        { data: 'id' },
        { data: 'cantidad' },
        { data: 'unidad' },
        { data: 'codigo' },
        {
          data: 'aprobado',
          "render": function (data, type, full, meta) {
            if (full.aprobado == 'si') {
              return ` <span class="badge badge-primary">Aprobado</span>`
            } else {
              return `<span class="badge badge-danger">No aprobado</span>`

            }

          }
        },
        { data: 'descripcion' },

      ]
    });
  }
  ver(x) {
    console.log(x)
    this.imagenes = x.imgs
    this.datos = x
    if (this.datos.tipo == 'list') {
      $('#tablita23').dataTable().fnDestroy();
      var events = $('#events');
      var codigo = $('#tablita23').DataTable({
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
        data: this.datos.kit,
        columns: [
          { data: 'id' },
          { data: 'cantidad' },
          { data: 'unidad' },
          { data: 'codigo' },
          {
            data: 'aprobado',
            "render": function (data, type, full, meta) {

              return `<div class="form-group form-check">
    <input type="checkbox" name="v-${full.id}"  class="form-check-input" id="v-${full.id}" value="true">
    <label class="form-check-label" for="exampleCheck1">Aprobar o No</label>
  </div>`
            }
          },

          { data: 'descripcion' },



        ]
      });


    }
  }
  acabar() {
    console.log(this.observaciones_finales, this.kits)
    var x = {
      actualizar: {
        observaciones_finales: this.observaciones_finales,
        kit: this.kits,
      },
      informacion: this.datos,
      recep: this.rece
    }
    this.api.terminarsolicitud(x).subscribe((data) => {
      console.log(data)
      alert("Se finalizo con exito!");
      $('#test-modal-9').modal('hide');
      this.ngOnInit()
      this.socket.emit('solicitud', { mensaje: "aprobada" });
    })
  }
  siguientepaso1() {
    this.siguientepasito1 = false
  }
  siguientepaso2() {

    console.log(this.recepcion)
  }
  cambioTodo(x) {
    console.log(x);
    for (let index = 0; index < this.datos.kit.length; index++) {
      this.datos.kit[index].completo = x.checked

    }
  }
  fotos(x) {
    console.log(x)
    console.log(x.imgs)
    if (String(x.idUsuario) === String(this.cookieService.get('cokidemiproyecto'))) {
      this.soyYo = true;
    } else {
      this.soyYo = false;
    }
    console.log(this.cookieService.get('cokidemiproyecto'));

    this.lafoto = "./assets/login.png"
    this.lamaquina = x
    this.lasfotos = x.imgs

  }
  acabar1() {
    var x = {
      informacion: this.datos,
      recepcion: this.recepcion
    }
    console.log(x);

    this.api.terminarlista(x).subscribe((data) => {
      alert("Se finalizo con exito!");
      $('#test-modal-88').modal('hide');
      this.ngOnInit()
      this.socket.emit('solicitud', { mensaje: "aprobada" });
    });
  }
  aprobar() {

    var opcion = confirm("Esta seguro? Se aprobara la solicitud");
    if (opcion == true) {
      console.log(this.datos)
      this.datos.viene = "img"
      this.datos.estado = "aprobado"
      this.api.aprobarsol(this.datos).subscribe((data) => {

        $('#test-modal-7').modal('hide');
        this.socket.emit('solicitud', { mensaje: "aprobada" });
        alert("Se aprobo la solicitud!");
      })
    } else {

    }


  }

  imprimir(row) {
    console.log(row);
    this.api.solicitudPorId(row.solicitud).subscribe((respuesta) => {
      console.log(respuesta.json());
      this.solicitudEmpresion = respuesta.json();
    });

    this.solicitudImpresion = row.kit;
  }

  aprobarTodo() {
    for (var i = this.datos.kit.length - 1; i >= 0; i--) {
      this.datos.kit[i].aprobado = "si"

    }
    this.datos.viene = "lista"
    var r = confirm("Seguro aprobara la solicitud?!");
    if (r == true) {
      this.datos.estado = "aprobado"
      this.api.aprobarsol(this.datos).subscribe((data) => {

        $('#test-modal-76').modal('hide');
        this.socket.emit('solicitud', { mensaje: "aprobada" });
        alert("Se aprobo la solicitud!");
      })
    }
    /*swal({
      title: "Se aprobara la solicitud",
      text: "Esta seguro?",
      icon: "info",
      buttons: true,
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          console.log(this.datos)
          

        } else {
          swal("Se cancelo la operacion!");
        }
      });*/
  }
  aprobar1() {

    for (var i = this.datos.kit.length - 1; i >= 0; i--) {

      console.log($("input:checkbox[name=v-" + this.datos.kit[i].id + "]:checked").val())
      if ($("input:checkbox[name=v-" + this.datos.kit[i].id + "]:checked").val() == "true") {
        this.datos.kit[i].aprobado = "si"
      } else {
        this.datos.kit[i].aprobado = "no"
      }
    }
    this.datos.viene = "lista"
    var r = confirm("Seguro aprobara la solicitud?!");
    if (r == true) {
      this.datos.estado = "aprobado"
      this.datos.estado = "aprobado"
      this.api.aprobarsol(this.datos).subscribe((data) => {

        $('#test-modal-76').modal('hide');
        this.socket.emit('solicitud', { mensaje: "aprobada" });
        alert("Se aprobo la solicitud!");
      })
    }
    /*swal({
      title: "Se aprobara la solicitud",
      text: "Esta seguro?",
      icon: "info",
      buttons: true,
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          console.log(this.datos)
          this.datos.estado = "aprobado"
          this.api.aprobarsol(this.datos).subscribe((data) => {

            $('#test-modal-76').modal('hide');
            this.socket.emit('solicitud', { mensaje: "aprobada" });
            swal("Se aprobo la solicitud!", {
              icon: "success",
            });
          })

        } else {
          swal("Se cancelo la operacion!");
        }
      });*/
  }
  desaprobar() {
    var r = confirm("Quiere rechazar la solicitud?!");
    if (r == true) {
      this.datos.estado = "rechazado"
      this.api.desaprobarsol(this.datos).subscribe((data) => {
        $('#test-modal-7').modal('hide');
        this.socket.emit('solicitud', { mensaje: "aprobada" });
        alert("Se rechazo la solicitud!");
      })
    }
    /*swal({
      title: "Quiere rechazar la solicitud?",
      text: "Esta seguro?",
      icon: "info",
      buttons: true,
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {

          this.datos.estado = "rechazado"
          this.api.desaprobarsol(this.datos).subscribe((data) => {
            $('#test-modal-7').modal('hide');
            this.socket.emit('solicitud', { mensaje: "aprobada" });
            swal("Se rechazo la solicitud!", {
              icon: "success",
            });
          })

        } else {
          swal("Se cancelo la operacion!");
        }
      });*/
  }
  desaprobar1() {
    var r = confirm("Quiere rechazar la solicitud?!");
    if (r == true) {

      this.datos.estado = "rechazado"
      this.api.desaprobarsol(this.datos).subscribe((data) => {
        $('#test-modal-76').modal('hide');
        this.socket.emit('solicitud', { mensaje: "aprobada" });
        alert("Se rechazo la solicitud!");
      })
    }
    /*swal({
      title: "Quiere rechazar la solicitud?",
      text: "Esta seguro?",
      icon: "info",
      buttons: true,
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {

          this.datos.estado = "rechazado"
          this.api.desaprobarsol(this.datos).subscribe((data) => {
            $('#test-modal-76').modal('hide');
            this.socket.emit('solicitud', { mensaje: "aprobada" });
            swal("Se rechazo la solicitud!", {
              icon: "success",
            });
          })

        } else {
          swal("Se cancelo la operacion!");
        }
      });*/
  }

  /*tabla*/
  updateList(id: number, property: string, event: any) {
    const editField = event.target.textContent;

    this.kits[id][property] = editField;
  }

  remove(id: any) {
    //this.awaitingPersonList.push(this.personList[id]);
    this.kits.splice(id, 1);
  }



  changeValue(id: number, property: string, event: any) {
    this.editField = event.target.textContent;
  }
  otralinea() {

    this.kits.push({
      id: this.contador,
      pieza: "  ",
      cantidad: 0,
      costo: 0,
      unidad: "  "

    })
    this.contador = this.contador + 1
  }
  diferente(e) {
    console.log(e)
    this.archivo = e.target.files
  }
  enviar1() {
    var x = new FormData()
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
  imp1() {

    $(".sectorimp").print();

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
      console.log(resultado)
      for (var i = resultado.length - 1; i >= 0; i--) {
        resultado[i].id = this.contador
        this.kits.push(resultado[i])
        this.contador = this.contador + 1
      }
      /*this.api.cargarbien(resultado).subscribe((data)=>{
        console.log(data)
        var ayuda=[]
        this.api.bienes().subscribe((data)=>{
          ayuda=data.json()
          console.log(data.json())
           this.latabla = new MatTableDataSource(ayuda);
           this.latabla.paginator = this.paginator;
          this.latabla.sort = this.sort;
          swal("Good job!", "You clicked the button!", "success");
        })
        
      })*/
    }

    oReq.send();
  }

  eliminarUnaFoto(x) {
    console.log(x);
    var opcion = confirm("Esta seguro? Se eliminar la foto");
    if (opcion == true) {
      console.log(this.datos)
      this.api.eliminarunaFoto({ url: x, maquina: this.lamaquina }).subscribe((respuesta) => {
        console.log(x);
        this.ngOnInit();
      });
      alert("Se elimino con exito!");
      var index = this.lasfotos.indexOf(x);
      if (index > -1) {
        this.lasfotos.splice(index, 1);
      }
    } else {

    }


  };

  cotizarlos() {
    var r = confirm("Quiere rechazar la solicitud?!");
    if (r == true) {
      this.datos.estado = "cotizando"
      this.api.cotizando(this.datos).subscribe((data) => {

        $('#test-modal-76').modal('hide');
        this.socket.emit('solicitud', { mensaje: "aprobada" });
        alert("Se mando a cotizar!");
      })
    }
    /* swal({
       title: "Se cotizara la solicitud",
       text: "Esta seguro?",
       icon: "info",
       buttons: true,
       dangerMode: true,
     })
       .then((willDelete) => {
         if (willDelete) {
           console.log(this.datos)
           this.datos.estado = "cotizando"
           this.api.cotizando(this.datos).subscribe((data) => {
 
             $('#test-modal-76').modal('hide');
             this.socket.emit('solicitud', { mensaje: "aprobada" });
             swal("Se mando a cotizar!", {
               icon: "success",
             });
           })
 
         } else {
           swal("Se cancelo la operacion!");
         }
       });*/
  }

}
function iuuu(x) {
  console.log(x)
}