import { Component, OnInit, ViewChild } from '@angular/core';

import { Router } from '@angular/router';
import { PrincipalService } from '../servicio/principal.service'
import { FormControl } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute } from '@angular/router';
import { Socket } from 'ngx-socket-io';


declare var $: any
declare var swal: any
declare var Swal: any
declare var XLSX: any

@Component({
  selector: 'app-cerrar-orden-preventiva',
  templateUrl: './cerrar-orden-preventiva.component.html',
  styleUrls: ['./cerrar-orden-preventiva.component.css']
})
export class CerrarOrdenPreventivaComponent implements OnInit {
  checked: boolean = false
  viene: any
  susfallas: any = {};
  solicitudes: any = []
  constructor(private route: ActivatedRoute, public socket: Socket, public api: PrincipalService, private router: Router, private cookieService: CookieService) {

  }
  maquinaria: any
  contador: number = 1
  fechaactual = new Date()
  fechaconclusion = new Date()
  editField: string;
  kits: Array<any> = []
  concluir: any = {}
  archivo: any
  tipo: any
  tipox: any
  total: number = 0
  od: any;
  tareas: any = [];
  listaTareas: any;
  ngOnInit() {


    this.api.versolicitudesc().subscribe((data) => {
      console.log(data.json());
      this.multiselect1(data.json());
    });


    this.route.params.subscribe(params => {
      console.log(params);
      this.tipox = params.caller;
      this.api.dedonde(params).subscribe((data) => {
        console.log('VIENE ', data.json());
        if (data.json().mensaje == 'no') {

        } else {
          this.susfallas = data.json().fallas;
          this.od = data.json()._id;
          this.viene = data.json().viene;
        }


        console.log(data.json());

        console.log(this.viene);
      })





      this.api.informacionprevencion1(params).subscribe((data) => {
        console.log(data.json());
        this.listaTareas = data.json();
        var p = data.json();

        this.multiselect(data.json());
      });

      this.concluir.nombre = params.nombre + " " + params.descripcion;
      this.concluir._id = params._id;
      this.tipo = params.tipo;

      if (params.tipo == "horometro") {
        this.concluir.tipo = "hor";
        this.concluir.horometro = params.horometro;
      } else {
        this.concluir.tipo = "hod";
        this.concluir.hodometro = params.hodometro;
      }
      // In a real app: dispatch action to load the details here.*/
    });
  }

  updateList(id: number, property: string, event: any) {
    const editField = event.target.textContent;

    this.kits[id][property] = editField;

    if (property == 'cantidad' || property == 'costo') {
      this.totales();
    }
  }

  remove(id: any) {
    //this.awaitingPersonList.push(this.personList[id]);
    this.kits.splice(id, 1);
    this.totales();
  }



  changeValue(id: number, property: string, event: any) {
    this.editField = event.target.textContent;
    if (property == 'cantidad' || property == 'costo') {
      this.totales()
    }
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
      this.totales()
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
  volver() {
    this.router.navigate(['home']);
  }
  toditos() {

    this.checked = !this.checked
  }
  terminado() {

    var titu = []
    console.log(this.susfallas),
      console.log(this.susfallas.lista);
    if (this.susfallas.lista != undefined) {
      for (var i = 0; i < this.susfallas.lista.length; ++i) {
        if ($("#e" + i + " :input:checkbox:checked").val() == undefined) {
          titu.push("false")
        } else {
          titu.push("true")
        }
        console.log(this.susfallas.lista[i] + " " + $("#e" + i + " :input:checkbox:checked").val())
      }
    }

    console.log(titu)

    var t = this.selectedItems1
    var tt = []
    for (var i = t.length - 1; i >= 0; i--) {
      tt.push(t[i].value)
    }
    var x = {
      archivo: {
        maquina: this.concluir._id,
        fechasalida: this.fechaconclusion,
        estado: "concluida",
        observaciones: this.concluir.observaciones,
        kit: this.kits,
        viene: this.viene,
        od: this.od
      },
      lista: titu,
      tipo: this.concluir.tipo,
      tipox: this.tipox,
      horometro: this.concluir.horometro,
      hodometro: this.concluir.hodometro,
      prevenciones: this.selectedItems,
      solicitudes: tt,
      tareas: this.tareas
    }
    console.log(x);
    this.socket.emit('cerrarorden', { mensaje: "aprobada" });
    this.api.cerrarod(x).subscribe((data) => {
      console.log(data.json())
      if (data.json().mensaje == 'sigue') {
        alert("No puede cerrar la orden! porque tiene solicitudes pendientes!");
      } else {
        this.router.navigate(['home']);
      }


    })

  }

  totales() {

    this.total = 0
    for (var i = this.kits.length - 1; i >= 0; i--) {

      var todo = parseFloat(this.kits[i].cantidad) * parseFloat(this.kits[i].costo)

      this.total = this.total + todo
    }

  }


  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  itemsbienes = []

  busquedaTareas(item) {
    this.tareas = [];
    console.log("TAREAS", this.listaTareas)
    console.log('ITE', item)
    for (let index = 0; index < this.listaTareas.length; index++) {
      if (this.listaTareas[index].tareas.length != 0) {
        this.selectedItems.forEach(element => {
          if (this.listaTareas[index]._id == element.value) {
            for (let index1 = 0; index1 < this.listaTareas[index].tareas.length; index1++) {
              for (let index2 = 0; index2 < this.listaTareas[index].tareas[index1].lista.length; index2++) {

                this.tareas.push({ subtarea: this.listaTareas[index].tareas[index1].lista[index2], completa: false, tarea: this.listaTareas[index].tareas[index1]._id });
              }

            }
          }
        });







      }
    }
  }

  onItemSelect(item: any) {
    console.log(item);
    this.busquedaTareas(item);
    console.log(this.selectedItems);
  }
  OnItemDeSelect(item: any) {
    console.log(item);
    this.busquedaTareas(item);
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
  multiselect(x) {
    this.itemsbienes = []
    var y = {}

    for (var i = x.length - 1; i >= 0; i--) {
      y = {
        "id": i,
        "itemName": x[i].nombre,
        "value": x[i]._id
      }
      this.itemsbienes.push(y)
    }
    this.dropdownSettings = {
      singleSelection: false,
      text: "Selecciona las Prevenciones",
      selectAllText: 'Elegir todos',
      unSelectAllText: 'Quitar todos',
      enableSearchFilter: true,
      classes: "myclass custom-class"
    };

  }
  multiselect1(x) {
    this.solicitudes = []
    var y = {}

    for (var i = x.length - 1; i >= 0; i--) {
      y = {
        "id": i,
        "itemName": x[i].nombre,
        "value": x[i]._id
      }
      this.solicitudes.push(y)
    }
    this.dropdownSettings1 = {
      singleSelection: false,
      text: "Selecciona la Solicitud",
      selectAllText: 'Elegir todos',
      unSelectAllText: 'Quitar todos',
      enableSearchFilter: true,
      classes: "myclass custom-class"
    };

  }
}
