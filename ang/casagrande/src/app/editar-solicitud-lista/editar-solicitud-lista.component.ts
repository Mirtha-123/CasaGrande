import { Component, OnInit } from '@angular/core';
import { PrincipalService } from '../servicio/principal.service'
import { CookieService } from 'ngx-cookie-service';
import { Router, ActivatedRoute } from '@angular/router';
declare var XLSX: any
declare var swal: any
@Component({
  selector: 'app-editar-solicitud-lista',
  templateUrl: './editar-solicitud-lista.component.html',
  styleUrls: ['./editar-solicitud-lista.component.css']
})
export class EditarSolicitudListaComponent implements OnInit {
  elservicio: any = ""
  paquete: any = {
    fall: {}
  }
  nombres: any
  fechaactual: any
  archivo: any
  editField: string;
  observaciones: any
  latabla: any = []
  kits: Array<any> = []
  contador: number = 1
  losp: any = []
  itemsbienes: any = []


  dropdownList1 = [];
  selectedItems1 = [];
  dropdownSettings1 = {};
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  pedido: any;

  solicitudNro: any;
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



  constructor(public api: PrincipalService, private cookieService: CookieService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.fechaactual = new Date();


    this.route.params.subscribe(params => {
      console.log(params);
      this.api.buscarSolicitudLista(params).subscribe((data: any) => {
        console.log(data.json());
        var datas = data.json();
        this.solicitudNro = params.id
        this.nombres = datas.nombre
        this.fechaactual = datas.fecha
        this.pedido = datas.mecanico
        this.observaciones = datas.observaciones
        this.kits = datas.kit
        this.api.bienes().subscribe((data1) => {
          this.multiselect(data1.json(), data.json())

        })
        this.api.losproyectos().subscribe((data2) => {
          this.multiselect1(data2.json(), data.json())
        })



      });;
    });


  }


  multiselect(x, z) {

    var y = {}
    console.log(x, z)


    for (var i = x.length - 1; i >= 0; i--) {

      y = {
        "id": i,
        "itemName": x[i].nombre + " " + x[i].descripcion,
        "value": x[i]._id
      }
      if (z.maquina == x[i]._id) {
        this.selectedItems = [y]
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
  multiselect1(x, z) {
    console.log(x);
    console.log(this.paquete);
    var y = {}

    for (var i = x.length - 1; i >= 0; i--) {
      y = {
        "id": i,
        "itemName": x[i].codigo + " " + x[i].nombre + " " + x[i].descripcion,
        "value": x[i]._id
      }
      if (z.proyecto == x[i]._id) {
        this.selectedItems1 = [y];
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

  otralinea() {

    this.kits.push({
      id: this.contador,
      pieza: " ",
      cantidad: 0,
      costo: 0,
      unidad: " ",
      codigo: " ",
      descripcion: " "

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


  guardando() {

    var lafe = new Date();
    var x = {}

    x = {
      mecanico: this.pedido,
      solicitud: this.solicitudNro,
      maquina: this.selectedItems[0].value,
      proyecto: this.selectedItems1[0].value,
      hora: (lafe.getHours()) + ':' + lafe.getMinutes(),
      observaciones: this.observaciones,
      kit: this.kits,
      usuario: this.cookieService.get('cokidemiproyecto'),
      tipo: "list",
      estado: "nueva",
      nombre: this.nombres
    }
    this.api.solicitudEditada(x).subscribe((data) => {
      console.log(data.json())
      this.router.navigate(['sol_com']);

    })
  }

}
