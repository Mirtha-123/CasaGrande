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
import { PushNotificationsService } from 'ng-push';
import { MensajeService } from '../mensaje/mensaje.service';
import { PreventivoItemComponent } from './preventivo-item/preventivo-item.component';
import { PreventivoKitComponent } from './preventivo-kit/preventivo-kit.component';
import { MatDialog } from '@angular/material';
import { PreventivoUsoKitsComponent } from './preventivo-uso-kits/preventivo-uso-kits.component';
import { PreventivoTareaAsignarComponent } from './preventivo-tarea-asignar/preventivo-tarea-asignar.component';
import { ImprimirTareaComponent } from './imprimir-tarea/imprimir-tarea.component';

declare var Push: any
declare var $: any
declare var swal: any
declare var Swal: any
declare var XLSX: any

@Component({
  selector: 'app-preventivo',
  templateUrl: './preventivo.component.html',
  styleUrls: ['./preventivo.component.css']
})
export class PreventivoComponent implements OnInit {

  // SELECT
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};



  fallas: any
  falla: any = {}
  listafallas: any = []
  transformacion: any
  atrans: any = {}
  message: any



  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  displayedColumns: string[] = ['semaforizacion', 'codigo', 'nombre', 'descripcion', 'horometro', 'hodometro', 'estadopre', 'ubicacion', 'acciones'];
  latabla: any = []
  ayuda: any = []
  maquina: any = {}
  preventivo: any = {}
  prevenciones: any = []
  pre: any
  odp: any = {}
  resumentodo: any = {}



  dropdownList1 = [];
  selectedItems1 = [];
  dropdownSettings1 = {};
  itemsbienes1 = []
  constructor(
    private messagingService: MensajeService,
    public api: PrincipalService,
    private _pushNotifications: PushNotificationsService,
    private socket: Socket,
    private router: Router,
    private cookieService: CookieService,
    public dialog: MatDialog,
  ) {
    this._pushNotifications.requestPermission();
    this.socket.on('parteactualizado', (data) => {
      this.ngOnInit()

    });
    this.socket.on('actualizarprevencion', (data) => {
      this.ngOnInit()

    });

  }
  notify(x, y) { //our function to be called on click
    let options = { //set options
      body: x,
      icon: "assets/1.png" //adding an icon
    }
    this._pushNotifications.create(y, options).subscribe( //creates a notification
      res => console.log(res),
      err => console.log(err)
    );
  }
  quitar(x) {
    var index = this.listafallas.indexOf(x);
    if (index > -1) {
      this.listafallas.splice(index, 1);
    }
  }
  fallasagregar() {
    this.listafallas.push(this.fallas)
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
      text: "Selecciona los Proyectos",
      selectAllText: 'Elegir todos',
      unSelectAllText: 'Quitar todos',
      enableSearchFilter: true,
      classes: "myclass custom-class"
    };
  }
  ngOnInit() {
    this.dropdownSettings = {
      singleSelection: true,
      text: 'Selecciona el item',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      classes: 'myclass custom-class'
    };
    this.api.informacionfiltrada().subscribe((data) => {
      console.log(data.json())
      this.multiproyectos(data.json().proyectos)

    })
    this.messagingService.requestPermission()
    this.messagingService.receiveMessage()
    this.message = this.messagingService.currentMessage


    /*this.api.avisonotifi().subscribe((data)=>{
    /* var ee=data.json()
      var ayuda:any
      var otraayuda:any
      var notifi:any=[]
      ee.forEach((element) =>{
        for(var aa in element){
          if (aa=='bien') {
            ayuda=element[aa]
          }else if(aa='aviso'){
            otraayuda=element[aa]
          }
         console.log(element)
        }
        var uu= setInterval(async ()=>{ this.notify(ayuda,otraayuda) }, 6000)
        notifi.push(uu)
      });
      for (var i = data.json().length - 1; i >= 0; i--) {
       this.notify(data.json()[i].aviso,data.json()[i].bien)
      /* var t=String(data.json()[i].aviso)
       var tt=String(data.json()[i].bien)
       setInterval(()=>{ this.notify(t,tt) }, 6000);
      }
    })*/
    this.api.bienesyprevenciones().subscribe((data) => {
      this.ayuda = data.json().bienes
      this.pre = data.json().prevencion

      this.resumenes()
      this.contar()

      this.latabla = new MatTableDataSource(this.ayuda);
      this.latabla.paginator = this.paginator;
      this.latabla.sort = this.sort;

    })
  }
  resumenes() {
    this.resumentodo = {
      alerta: 0,
      atencion: 0,
      tranquilos: 0
    }
    this.resumentodo.general = this.ayuda.length
    console.log(this.ayuda)
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
  contar() {
    console.log(this.ayuda, this.pre)
    for (var id = this.ayuda.length - 1; id >= 0; id--) {
      this.ayuda[id].alerta = 0
      this.ayuda[id].atencion = 0
      this.ayuda[id].tranquilos = 0
    }
    for (var ib = this.ayuda.length - 1; ib >= 0; ib--) {
      for (var ic = this.pre.length - 1; ic >= 0; ic--) {
        if (this.ayuda[ib]._id == this.pre[ic].bien._id) {




          if (this.ayuda[ib].tipo == "horometro") {
            if (parseFloat(this.ayuda[ib].horometro) >= parseFloat(this.pre[ic].proximo)) {
              this.ayuda[ib].alerta = parseFloat(this.ayuda[ib].alerta) + parseFloat('1')
            } else if (parseFloat(this.ayuda[ib].horometro) >= (parseFloat(this.pre[ic].proximo) - parseFloat(this.pre[ic].aviso))) {
              this.ayuda[ib].atencion = parseFloat(this.ayuda[ib].atencion) + parseFloat('1')
            } else {
              this.ayuda[ib].tranquilos = parseFloat(this.ayuda[ib].tranquilos) + parseFloat('1')
            }
          } else {
            if (parseFloat(this.ayuda[ib].hodometro) >= parseFloat(this.pre[ic].proximo)) {
              this.ayuda[ib].alerta = parseFloat(this.ayuda[ib].alerta) + parseFloat('1')
            } else if (parseFloat(this.ayuda[ib].hodometro) >= (parseFloat(this.pre[ic].proximo) - parseFloat(this.pre[ic].aviso))) {
              this.ayuda[ib].atencion = parseFloat(this.ayuda[ib].atencion) + parseFloat('1')
            } else {
              this.ayuda[ib].tranquilos = parseFloat(this.ayuda[ib].tranquilos) + parseFloat('1')
            }
          }






        }
      }
    }

    console.log(this.ayuda)




  }
  applyFilter(filterValue: string) {
    this.latabla.filter = filterValue.trim().toLowerCase();

    if (this.latabla.paginator) {
      this.latabla.paginator.firstPage();
    }
  }
  generarprevencion(x) {
    console.log(x);
    this.maquina = x;
    this.obtenerItems();
  }

  eliminarestaprevencion(x) {
    console.log(x)
    var opcion = confirm("Esta seguro ? Se eliminara la prevencion " + x.nombre + " con ID:" + x._id);
    if (opcion == true) {
      this.api.eliminarprevencion(x).subscribe((data) => {
        alert("Se elimino con exito!");
        this.generarprevencion1(x)
      })
    } else {

    }
   
  }
  generarprevencion1(x) {
    console.log(x)
    this.maquina = x
    this.api.verprevenciones(x).subscribe((data) => {
      this.prevenciones = data.json()

      for (var i = this.prevenciones.length - 1; i >= 0; i--) {
        if (this.prevenciones[i].bien.tipo == "horometro") {
          if (parseFloat(this.prevenciones[i].bien.horometro) >= parseFloat(this.prevenciones[i].proximo)) {
            this.prevenciones[i].status = "alerta"
          } else if (parseFloat(this.prevenciones[i].bien.horometro) >= (parseFloat(this.prevenciones[i].proximo) - parseFloat(this.prevenciones[i].aviso))) {
            this.prevenciones[i].status = "atencion"
          } else {
            this.prevenciones[i].status = "tranquilos"
          }
        } else {
          if (parseFloat(this.prevenciones[i].bien.hodometro) >= parseFloat(this.prevenciones[i].proximo)) {
            this.prevenciones[i].status = "alerta"
          } else if (parseFloat(this.prevenciones[i].bien.hodometro) >= (parseFloat(this.prevenciones[i].proximo) - parseFloat(this.prevenciones[i].aviso))) {
            this.prevenciones[i].status = "atencion"
          } else {
            this.prevenciones[i].status = "tranquilos"
          }
        }


      }



      console.log(this.prevenciones)
    })
  }



  guardar() {

    this.preventivo.nombre.trim()
    this.preventivo.nombre = this.preventivo.nombre.replace(/ /g, "_")
    console.log(this.preventivo)

    this.preventivo.bien = this.maquina._id
    var x = this.preventivo
    if (this.preventivo.aviso == 0) {
      this.preventivo.aviso = 50
    }

    if (this.maquina.tipo == "horometro") {
      this.preventivo.proximo = parseFloat(this.preventivo.partida) + parseFloat(this.preventivo.anticipacion)
    } else {
      this.preventivo.proximo = parseFloat(this.maquina.hodometro) + parseFloat(this.preventivo.anticipacion)
    }

    console.log(this.selectedItems);
    console.log(this.selectedItems[0]);
    if (this.selectedItems.length != 0) {
      this.preventivo.item = this.selectedItems[0].id;
    }

    this.api.preventivonuevo(this.preventivo).subscribe((data) => {
      this.socket.emit('nuevopreventivo', { mensaje: "aprobada" });
      this.preventivo = {}
      alert("Gracias se cargo correctamente!");


    })

  }
  solicitudPreventivo(row) {

  }
  odps() {

    console.log(this.odp)
    var x = {
      fecha: this.odp.fecha,
      maquina: this.odp.nombre,
      mecanico: this.odp.mecanico,
      estado: "p_mantenimiento",
      fechasalida: "",
      observaciones: this.odp.observaciones,
      tipo: "preventivo"
    }
    this.api.enviarorden(x).subscribe((data) => {
      console.log(data)
      if (data.json().mensaje == "ya esta") {
        alert('El equipo ya esta en mantenimiento!')
       

      } else {
        this.ngOnInit()
        $('.bd-example-modal-lg3').modal('hide');

        alert("Gracias se cargo correctamente!");
      }

    })
  }
  ordenpreventiva(x) {
    this.odp.nombre = x._id
  }
  cambio() {
    this.lo()
  }
  lo() {
    $('#alu').dataTable().fnDestroy();
    $("#marca").empty()
    console.log("entro lo")
    $("#marca").append(`
  		<table class="table" id="alu" >
			        <thead>
			          <tr id="cabeza">
			            
			            <th>Maquina</th>
			            <th>Codigo</th>
			            <th>Horometro Actual</th>
			            <th>Hodometro Actual</th>
			            
			          </tr>
			        </thead>
			        <tbody style="color: black" id="pedro">
			        	
			        </tbody>
      </table>
  		`)

    var lasprevenciones: any = []
    var listadereport = []
    var detalledereporte: any = {}
    for (var ic = this.pre.length - 1; ic >= 0; ic--) {
      lasprevenciones.push(this.pre[ic].nombre)
    }
    let sinRepetidos = lasprevenciones.filter(function (valor, indiceActual, arreglo) {
      let indiceAlBuscar = arreglo.indexOf(valor);
      if (indiceActual === indiceAlBuscar) {
        return true;
      } else {
        return false;
      }
    });


    for (var id1 = sinRepetidos.length - 1; id1 >= 0; id1--) {
      $("#cabeza").append(`
  			<th>${sinRepetidos[id1]}</th>  
			               	`)
    }
    $("#cabeza").append(`
  		
			            
			            <th>Ubicacion</th>
			            <th>Encargado</th>
			            
			        
  		`)


    for (var ia = this.ayuda.length - 1; ia >= 0; ia--) {

      detalledereporte = {}
      detalledereporte.bien = this.ayuda[ia].nombre + " " + this.ayuda[ia].descripcion
      detalledereporte.codigo = this.ayuda[ia].codigo
      detalledereporte.horometro = this.ayuda[ia].horometro
      detalledereporte.hodometro = this.ayuda[ia].hodometro


      for (var ix = sinRepetidos.length - 1; ix >= 0; ix--) {

        var verificador = 0
        for (var ib = this.pre.length - 1; ib >= 0; ib--) {
          if (this.ayuda[ia]._id == this.pre[ib].bien._id) {

            if (sinRepetidos[ix] == this.pre[ib].nombre) {
              if (this.ayuda[ia].tipo == "horometro") {
                if (sinRepetidos[ix] == this.pre[ib].nombre) {
                  eval("detalledereporte." + sinRepetidos[ix] + " = parseFloat(this.pre[ib].proximo) - parseFloat(this.ayuda[ia].horometro)")
                  if (parseFloat(this.pre[ib].bien.horometro) >= parseFloat(this.pre[ib].proximo)) {
                    eval("detalledereporte." + sinRepetidos[ix] + "1 ='alerta'")
                  } else if (parseFloat(this.pre[ib].bien.horometro) >= (parseFloat(this.pre[ib].proximo) - parseFloat(this.pre[ib].aviso))) {
                    eval("detalledereporte." + sinRepetidos[ix] + "1 ='atencion'")
                  } else {
                    eval("detalledereporte." + sinRepetidos[ix] + "1 ='tranquilos'")
                  }
                  verificador = verificador + 1
                }

              } else {
                if (sinRepetidos[ix] == this.pre[ib].nombre) {
                  eval("detalledereporte." + sinRepetidos[ix] + " = parseFloat(this.pre[ib].proximo) - parseFloat(this.ayuda[ia].hodometro)")
                  if (parseFloat(this.pre[ib].bien.hodometro) >= parseFloat(this.pre[ib].proximo)) {
                    eval("detalledereporte." + sinRepetidos[ix] + "1 ='alerta'")
                  } else if (parseFloat(this.pre[ib].bien.hodometro) >= (parseFloat(this.pre[ib].proximo) - parseFloat(this.pre[ib].aviso))) {
                    eval("detalledereporte." + sinRepetidos[ix] + "1 ='atencion'")
                  } else {
                    eval("detalledereporte." + sinRepetidos[ix] + "1 ='tranquilos'")
                  }
                  verificador = verificador + 1

                }
              }
            }
          }
        }
        if (verificador == 0) {
          eval("detalledereporte." + sinRepetidos[ix] + " = 'N/A'")
          eval("detalledereporte." + sinRepetidos[ix] + "1 = 'nulo'")

        }

      }
      detalledereporte.ubicacion = this.ayuda[ia].ubicacion
      if (this.ayuda[ia].encargado[1] != null || this.ayuda[ia].encargado[1] != undefined) {
        detalledereporte.encargado = this.ayuda[ia].encargado[0].nombre + " " + this.ayuda[ia].encargado[0].apaterno
      } else {
        detalledereporte.encargado = "No tiene"
      }
      console.log(detalledereporte)
      listadereport.push(detalledereporte)

    }

    for (var iq = listadereport.length - 1; iq >= 0; iq--) {
      $("#pedro").append(`<tr id="${iq}">
  			

  			</tr>
  			`)
      for (var i in listadereport[iq]) {

        if (i.indexOf('1') != -1) {
          console.log("entre")
        } else {
          var x = eval('listadereport[iq].' + i)
          var y
          if (i != "codigo") {
            if (i != "bien") {
              if (i != "horometro") {
                if (i != "hodometro") {
                  if (i != "ubicacion") {
                    if (i != "encargado") {
                      switch (eval('listadereport[iq].' + i + '1')) {
                        case "alerta":
                          y = "assets/alerta.png"
                          $('#' + iq).append(`<td style="color:red">${x} <img src="${y}" style="width:15px;" class="iconoo"></td>`)
                          break;
                        case "atencion":
                          y = "assets/precaucion.png"
                          $('#' + iq).append(`<td style="color:yellow">${x} <img src="${y}" style="width:15px;" class="iconoo"></td>`)
                          break;
                        case "tranquilos":
                          y = "assets/good.png"
                          $('#' + iq).append(`<td style="color:green">${x} <img src="${y}" style="width:15px;" class="iconoo"></td>`)
                          break;
                        case "nulo":
                          y = "assets/good.png"
                          $('#' + iq).append(`<td >${x} <img src="${y}" style="width:15px;" class="iconoo"></td>`)
                          break;
                        default:
                          // code...
                          break;
                      }
                    } else { $('#' + iq).append(`<td>${x}</td>`) }

                  } else { $('#' + iq).append(`<td>${x}</td>`) }
                } else { $('#' + iq).append(`<td>${x}</td>`) }
              } else { $('#' + iq).append(`<td>${x}</td>`) }


            } else {
              $('#' + iq).append(`<td>${x}</td>`)
            }
          } else {
            $('#' + iq).append(`<td>${x}</td>`)
          }
        }



      }
    }
    console.log(listadereport)
    var printCounter = 0;
    this.ver()



  }


  ver() {
    $('#alu').DataTable({
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
          extend: 'csv',
          text: 'CSV',
          className: 'orange',

        },
        {
          extend: 'excel',
          text: 'Excel',
          className: 'green',
          exportOptions: {
            columns: ':visible',

          }
        },
        {
          extend: 'print',
          text: 'Imprimir',

          className: 'icon',
          exportOptions: {
            columns: ':visible',
            stripHtml: false,
          }
        },
        {
          extend: 'colvis',
          text: 'Ordenar',
          className: 'green'
        }
      ],
      responsive: true,
    });

    $("#alu_wrapper").addClass("alu")
    $("#marca").addClass("paratabla")

  }
  transformar(x) {
    console.log(x)
    this.atrans = x
  }
  async solicitar(x) {
    /*const xy = await this.api.solicitudDGS({
      "Usuario": "dgsoil02",
      "Clave": "dgs170",
      "Placa": "2503RIY"
    }).subscribe((respuesta) => {
      console.log(respuesta);
    });*/
    this.router.navigate(['/sol_com/nueva_solicitud_lista_preventiva/' + x._id]);
    console.log(x)
  }

  trans() {


    var x = {
      falla: this.falla,
      proy: this.selectedItems1,
      lista: this.listafallas,
      maq: this.atrans,

    }

    console.log(x);
    var opcion = confirm("Esta seguro ? Se transformara la prevencion");
    if (opcion == true) {
      this.api.transformar(x).subscribe((data) => {
        if (data.json().mensaje == 'estaconcorrectivo') {
          alert("El equipo ya tiene un mantenimiento correctivo");
        } else if (data.json().mensaje == 'transformado') {
          alert("Se transformo la orden");
          this.ngOnInit()
        }
      })
    } else {

    }

  





  }
  items(x) {
    const dialogRef = this.dialog.open(PreventivoItemComponent, {
      width: '70%',
      height: '90%',
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
  imprimirTareas(x) {
    const dialogRef3 = this.dialog.open(ImprimirTareaComponent, {
      width: '70%',
      height: '90%',
      data: {
        bien: x,
      },
      disableClose: false
    });

    dialogRef3.afterClosed().subscribe(result => {
      if (result) {

      }
    });
  }
  tarea(x) {
    const dialogRef2 = this.dialog.open(PreventivoTareaAsignarComponent, {
      width: '70%',
      height: '90%',
      data: {
        bien: x,
      },
      disableClose: false
    });

    dialogRef2.afterClosed().subscribe(result => {
      if (result) {

      }
    });
  }
  kits(x) {
    const dialogRef1 = this.dialog.open(PreventivoUsoKitsComponent, {
      width: '70%',
      height: '90%',
      data: {
        bien: x,
      },
      disableClose: false
    });

    dialogRef1.afterClosed().subscribe(result => {
      if (result) {

      }
    });
  }

  obtenerItems() {
    console.log(this.maquina);
    this.api.misItems(this.maquina).subscribe((respuesta) => {
      const elementos = [];
      respuesta.json().forEach(element => {
        elementos.push({ id: element._id, itemName: element.nombre + ' ' + element.descripcion });
      });
      console.log(elementos);
      this.dropdownList = elementos;
      console.log(respuesta.json());
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
