import { Component, OnInit } from '@angular/core';
import { PrincipalService } from '../servicio/principal.service'
import { CookieService } from 'ngx-cookie-service';
import { Router, ActivatedRoute } from '@angular/router';
declare var XLSX: any
declare var swal: any
@Component({
  selector: 'app-nuevasolicitudlista',
  templateUrl: './nuevasolicitudlista.component.html',
  styleUrls: ['./nuevasolicitudlista.component.css']
})
export class NuevasolicitudlistaComponent implements OnInit {
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
    this.fechaactual = new Date((new Date().getTime()));
    console.log(this.fechaactual);
    this.route.params.subscribe(params => {
      console.log(params);

      if (params.id == "simple") {
        // code...
      } else {
        console.log(this.elservicio);
        this.elservicio = params.id;
        this.api.buscarser({ men: this.elservicio }).subscribe((data) => {
          console.log(data.json());
          this.paquete = data.json();
        });
      }
    });

    this.api.micorre().subscribe((data) => {
      this.nombres = data.json().toca
    })
    this.api.bienes().subscribe((data) => {
      this.multiselect(data.json())
    })
    this.api.losproyectos().subscribe((data) => {
      this.multiselect1(data.json())
    })





  }
  guardando() {
    this.route.params.subscribe(params => {
      var lafe = new Date();
      var x = {}
      if (params.id == "simple") {
        x = {
          mecanico: this.pedido,
          maquina: this.selectedItems[0].value,
          proyecto: this.selectedItems1[0].value,
          hora: (lafe.getHours()) + ':' + lafe.getMinutes(),
          fecha: this.fechaactual.getFullYear() + "-" + ("0" + (parseFloat(this.fechaactual.getMonth()) + 1)).slice(-2) + "-" + ("0" + this.fechaactual.getDate()).slice(-2),
          observaciones: this.observaciones,
          kit: this.kits,
          usuario: this.cookieService.get('cokidemiproyecto'),
          tipo: "list",
          estado: "nueva",
          nombre: this.nombres
        }
        this.api.solicitudnueva(x).subscribe((data) => {
          if (data.json().mensaje == "yaay") {
            alert("Ya existe ese nombre!");
          } else {
            this.router.navigate(['sol_com']);
          }
        })
        console.log(x)
      } else {
        x = {
          mecanico: this.pedido,
          maquina: this.selectedItems[0].value,
          proyecto: this.selectedItems1[0].value,
          orden: this.paquete.serv._id,
          hora: (lafe.getHours()) + ':' + lafe.getMinutes(),
          fecha: this.fechaactual.getFullYear() + "-" + ("0" + (parseFloat(this.fechaactual.getMonth()) + 1)).slice(-2) + "-" + ("0" + this.fechaactual.getDate()).slice(-2),
          observaciones: this.observaciones,
          kit: this.kits,
          usuario: this.cookieService.get('cokidemiproyecto'),
          tipo: "list",
          estado: "nueva",
          nombre: this.nombres
        }
        this.api.solicitudnueva(x).subscribe((data) => {
          if (data.json().mensaje == "yaay") {
            alert("Ya existe ese nombre!");
          } else {
            this.router.navigate(['sol_com']);
          }
        })
        console.log(x)

      }
    });

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

  multiselect(x) {

    this.route.params.subscribe(params => {
      var y = {}


      if (params.id == "simple") {
        for (var i = x.length - 1; i >= 0; i--) {
          y = {
            "id": i,
            "itemName": x[i].nombre + " " + x[i].descripcion,
            "value": x[i]._id
          }
          this.itemsbienes.push(y)
        }
      } else {

        for (var i = x.length - 1; i >= 0; i--) {

          y = {
            "id": i,
            "itemName": x[i].nombre + " " + x[i].descripcion,
            "value": x[i]._id
          }
          if (params.id == x[i]._id) {
            this.selectedItems = [y]
          }
          this.itemsbienes.push(y)
        }





      }
      this.dropdownSettings = {
        singleSelection: true,
        text: "Selecciona los Bienes",
        selectAllText: 'Elegir todos',
        unSelectAllText: 'Quitar todos',
        enableSearchFilter: true,
        classes: "myclass custom-class"
      };
    });


  }
  multiselect1(x) {
    console.log(x);
    console.log(this.paquete);
    var y = {}

    for (var i = x.length - 1; i >= 0; i--) {
      y = {
        "id": i,
        "itemName": x[i].codigo + " " + x[i].nombre + " " + x[i].descripcion,
        "value": x[i]._id
      }
      if (this.paquete.fall.proyecto == x[i]._id) {
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



}
