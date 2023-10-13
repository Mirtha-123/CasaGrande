import { Component, OnInit, ViewChild } from '@angular/core';

import { Router } from '@angular/router';
import { PrincipalService } from '../servicio/principal.service'
import { FormControl } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute } from '@angular/router';

import { FileSelectDirective, FileUploader } from 'ng2-file-upload'
import { Socket } from 'ngx-socket-io';
import { DatePipe } from '@angular/common';


declare var $: any
declare var swal: any
declare var Swal: any
declare var XLSX: any

const URL = 'https://casagrande-erp.com/api/upload';
//const URL = 'http://167.99.230.192:3000/api/upload';
@Component({
  selector: 'app-nuevasolicitud',
  templateUrl: './nuevasolicitud.component.html',
  styleUrls: ['./nuevasolicitud.component.css'],
  providers: [DatePipe]
})
export class NuevasolicitudComponent implements OnInit {
  nombres: any

  compra: any = {
    imgs: []
  }

  contador: number = 1

  editField: string;
  kits: Array<any> = []
  archivo: any
  fechaactual:any = new Date();


  color = 'primary';
  mode = 'determinate';
  value = 50;
  bufferValue = 75;
  solicitud: any = {

  }


  losp: any = []
  public hasBaseDropZoneOver: boolean = false;
  public hasAnotherDropZoneOver: boolean = false;

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }



  public uploader: FileUploader = new FileUploader({ url: URL, itemAlias: 'photo' });


  constructor(private datePipe: DatePipe, private route: ActivatedRoute, private socket: Socket, public api: PrincipalService, private router: Router, private cookieService: CookieService) {
    //this.socket = io()

  }
  dropdownList1 = [];
  selectedItems1 = [];
  dropdownSettings1 = {};
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  itemsbienes = []

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


  ngOnInit() {
    this.fechaactual = new Date((new Date().getTime() - 3888000000));
    console.log(this.fechaactual);
    this.api.micorre().subscribe((data) => {
      this.nombres = data.json().toca
    })
    this.api.bienes().subscribe((data) => {
      this.multiselect(data.json())
    })

    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      console.log('ImageUpload:uploaded:', item, status, response);

      var x = JSON.parse(response)
      this.compra.imgs.push(x.success.secure_url)
      console.log(x)


      alert("Gracias se cargo correctamente!");

    };

    this.api.losproyectos().subscribe((data) => {
      this.multiselect1(data.json())
    })
  }
  nuevo() {
    this.router.navigate(['nueva_solicitud']);
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

    }

    oReq.send();
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
      singleSelection: true,
      text: "Selecciona los Bienes",
      selectAllText: 'Elegir todos',
      unSelectAllText: 'Quitar todos',
      enableSearchFilter: true,
      classes: "myclass custom-class"
    };

  }
  multiselect1(x) {
    var y = {}

    for (var i = x.length - 1; i >= 0; i--) {
      y = {
        "id": i,
        "itemName": x[i].codigo + " " + x[i].nombre + " " + x[i].descripcion,
        "value": x[i]._id
      }
      this.losp.push(y)
    }
    this.dropdownSettings1 = {
      singleSelection: true,
      text: "Selecciona el proyecto",
      selectAllText: 'Elegir todos',
      unSelectAllText: 'Quitar todos',
      enableSearchFilter: true,
      classes: "myclass custom-class"
    };

  }
  genial() {
    this.compra.fecha = this.fechaactual.getFullYear() + "-" + ("0" + this.fechaactual.getMonth()).slice(-2) + "-" + ("0" + this.fechaactual.getDate()).slice(-2)
    this.compra.maquina = this.selectedItems[0].value
    this.compra.proyecto = this.selectedItems1[0].value
    this.compra.tipo = "img"
    this.compra.estado = "nueva"
    this.compra.usuario = this.cookieService.get('cokidemiproyecto')
    this.compra.nombre = this.nombres
    console.log(this.compra)
    this.socket.emit('nueva', { mensaje: "aprobada" });
    this.api.solicitudnueva(this.compra).subscribe((data) => {
      if (data.json().mensaje == "yaay") {
        alert("Ya existe ese nombre!");
      } else {
        this.router.navigate(['sol_com']);
      }

    })
  }
}
