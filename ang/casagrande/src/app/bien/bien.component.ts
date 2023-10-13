import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PrincipalService } from '../servicio/principal.service'
import { FormControl } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { FileUploader } from 'ng2-file-upload';
import { MatDialog } from '@angular/material/dialog';
import { ItemsComponent } from './items/items.component';




declare var $: any
declare var swal: any
declare var Swal: any
declare var XLSX: any


//const URL = 'http://167.99.230.192:3000/api/upload';
const URL = 'https://casagrande-erp.com/api/upload';
@Component({
  selector: 'app-bien',
  templateUrl: './bien.component.html',
  styleUrls: ['./bien.component.css']
})
export class BienComponent implements OnInit {
  loading: any
  lafoto: any = "./assets/auto.png"
  //subir imagenes
  lasfotos: any = []
  lamaquina: any = {
    fotos: []
  }
  fotito: any
  response: string;
  compra: any = {
    imgs: []
  }

  public hasBaseDropZoneOver: boolean = false;
  public hasAnotherDropZoneOver: boolean = false;

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }



  public uploader: FileUploader = new FileUploader({ url: URL, itemAlias: 'photo' });










  mispermitidos: any = {
    editar: false,
    eliminar: false,
    encargados: false,
    ver: false,
    agregar: false
  }





  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  displayedColumns: string[] = ['semaforizacion', 'codigo', 'nombre', 'categoria','modelo','descripcion', 'serieM','serieMo' ,'estado', 'acciones'];
  latabla: any = []
  bien: any = {
    nombre: "",
    descripcion: "",
    horometro: "",
    hodometro: "",
    estado: "",
    ubicacion: "",
    encargado: [],
    categoria: ""
  }
  importacion: any
  archivo: Array<File>
  ayuda: any
  tabla1: boolean = true
  tabla2: boolean = false
  toogle: boolean = false
  totalb: any = 0
  busquedausuario: any
  toppingList: any = []
  maquinaria: any = {
    encargado: []
  }
  tipo1: boolean = false
  tipo2: boolean = false
  totalmant: number = 0
  totalliberado: number = 0
  inactivo: number = 0
  newb: boolean = false
  edb: boolean = false
  mandar(x) {
    this.lafoto = x
  }
  cambio(x) {
    if (x.target.value == "horometro") {
      this.tipo1 = true
      this.tipo2 = false
      this.bien.hodometro = 0
      this.bien.horometro = 0
    } else {
      this.tipo1 = false
      this.tipo2 = true
      this.bien.hodometro = 0
      this.bien.horometro = 0
    }

    console.log(x.target.value)
  }
  quitarpersonal(x) {

    var busqueda = this.maquinaria.encargado.indexOf(x)
    if (busqueda > -1) {
      this.maquinaria.encargado.splice(busqueda, 1);
    }

  }
  applyFilter(filterValue: string) {
    this.latabla.filter = filterValue.trim().toLowerCase();

    if (this.latabla.paginator) {
      this.latabla.paginator.firstPage();
    }
  }

  items(x) {
    const dialogRef = this.dialog.open(ItemsComponent, {
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
  constructor(public api: PrincipalService, public dialog: MatDialog, private router: Router, private cookieService: CookieService) { }

  ngOnInit() {
    console.log("hola soy el bien")

    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      console.log('ImageUpload:uploaded:', item, status, response);

      var x = JSON.parse(response)
      this.fotito = x.success.secure_url
      console.log(x)
      var p = {
        fotito: this.fotito,
        datos: this.lamaquina
      }

      this.api.lafotito(p).subscribe((data) => {
        this.lasfotos.push(x.success.secure_url)
        alert("Gracias se cargo correctamente!");
      })


    };






    var x = {
      id: this.cookieService.get('cokidemiproyecto'),
      modulo: "Bienes"
    }
    this.api.mispermisos(x).subscribe((dataa) => {
      var expresion = dataa.json().botones

      for (var i = expresion.length - 1; i >= 0; i--) {
        if (expresion[i].nombre == "Eliminar" && expresion[i].estado == true) {
          this.mispermitidos.eliminar = true
        }
        if (expresion[i].nombre == "Editar" && expresion[i].estado == true) {
          this.mispermitidos.editar = true
        }
        if (expresion[i].nombre == "Encargados" && expresion[i].estado == true) {
          this.mispermitidos.encargados = true
        }
        if (expresion[i].nombre == "Agregar" && expresion[i].estado == true) {
          this.mispermitidos.agregar = true
        }
        if (expresion[i].nombre == "Ver" && expresion[i].estado == true) {
          this.mispermitidos.ver = true
        }
      }
      this.api.bienes().subscribe((data) => {
        this.ayuda = data.json()
        console.log(data.json())
        this.latabla = new MatTableDataSource(this.ayuda);
        this.latabla.paginator = this.paginator;
        this.latabla.sort = this.sort;
        this.totalbienes()
        this.totalmantenimientos()
      })



    })



  }
  totalmantenimientos() {
    this.inactivo = 0
    this.totalliberado = 0
    this.totalmant = 0
    for (var i = this.ayuda.length - 1; i >= 0; i--) {
      if (this.ayuda[i].estado == "mantenimiento") {
        this.totalmant = this.totalmant + 1
      }
      if (this.ayuda[i].estado == "liberado") {
        this.totalliberado = this.totalliberado + 1
      }
      if (this.ayuda[i].estado == "offline") {
        this.inactivo = this.inactivo + 1
      }

    }
  }
  buscarusuario() {
    var x = {
      palabra: this.busquedausuario
    }
    this.api.buscarusuario(x).subscribe((data) => {
      console.log(data.json())
      this.toppingList = data.json()
    })
  }
  agregarpersonal(x) {
    console.log(x)
    this.maquinaria.encargado.push(x)
  }
  maquina(x) {
    this.maquinaria = x
  }
  totalbienes() {
    this.totalb = 0
    this.totalb = this.ayuda.length
  }
  encargadobien() {
    var x = []
    for (var i = this.maquinaria.encargado.length - 1; i >= 0; i--) {
      x.push(this.maquinaria.encargado[i]._id)
    }
    var y = {
      maquina: this.maquinaria._id,
      codi: x
    }
    console.log(x)
    this.api.encargadobien(y).subscribe((data) => {
      console.log(data)
      $('#test-modal-5').modal('hide');
      alert('Se actualizo los encargados')
     

    })
  }
  enviar() {
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
  diferente(e) {
    console.log(e)
    this.archivo = e.target.files
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
      this.api.cargarbien(resultado).subscribe((data) => {
        console.log(data)
        var ayuda = []
        this.api.bienes().subscribe((data) => {
          ayuda = data.json()
          console.log(data.json())
          this.latabla = new MatTableDataSource(ayuda);
          this.latabla.paginator = this.paginator;
          this.latabla.sort = this.sort;
          alert("Good job!");
        })

      })
    }

    oReq.send();
  }

  terminar() {
    if (this.bien.anticipacion == 0) {
      this.bien.anticipacion = 50
    }
    this.bien.semaforizacion = "libre"
    this.bien.estadopre = "liberado"
    if (this.bien.tipo == "horometro") {
      this.bien.proximo = parseFloat(this.bien.horometro) + parseFloat(this.bien.aviso)
    } else {
      this.bien.proximo = parseFloat(this.bien.hodometro) + parseFloat(this.bien.aviso)
    }


    this.api.crear(this.bien).subscribe((data) => {
      if (data.json().mensaje == "yaexiste") {
        alert("El Bien con esa cuenta ya existe");
      } else {
        alert("El Documento se cargo bien");
        this.ngOnInit()
      }

    })
    console.log(this.bien)
  }
  biened(x) {
    this.bien = x
    this.edb = true
    this.newb = false
  }
  nb() {
    this.bien = {}
    this.newb = true
    this.edb = false
  }
  edibien() {
    if (this.bien.anticipacion == 0) {
      this.bien.anticipacion = 50
    }
    this.bien.semaforizacion = "libre"
    this.bien.encargado.push("5d07a55f7c9f4a1438e1ad15")
    if (this.bien.tipo == "horometro") {
      this.bien.proximo = parseFloat(this.bien.horometro) + parseFloat(this.bien.aviso)
    } else {
      this.bien.proximo = parseFloat(this.bien.hodometro) + parseFloat(this.bien.aviso)
    }
    $("#exampleModal").modal('hide')
    var opcion = confirm("Esta seguro? Editara los datos!");
    if (opcion == true) {
      this.api.editarunbien(this.bien).subscribe((data) => {
        alert("El Documento se actualizo");
      })
    } else {

    }
    







    console.log(this.bien)
  }
  eliminarb(x) {
    swal({
      title: "Esta Seguro?",
      text: "Eliminara los datos!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          this.api.eliminarunbien(x).subscribe((data) => {
            this.ngOnInit()
            console.log(data)
            swal("El Documento se elimino", {
              icon: "success",
            });
          })

        }
      });

  }
  reporte() {
    if (this.toogle == false) {
      this.tabla2 = true
      this.tabla1 = false
      this.toogle = true
    } else {
      this.tabla2 = false
      this.tabla1 = true
      this.toogle = false
    }

    this.api.bienes().subscribe((data) => {
      var x = data.json()

      var codigo = $('#tablita').DataTable({
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
        data: x,
        columns: [
          { data: 'codigo' },
          { data: 'nombre' },
          { data: 'descripcion' },
          { data: 'horometro' },
          { data: 'hodometro' },
          { data: 'estado' },
          { data: 'semaforizacion' },

        ]
      });
      codigo.buttons().container()
        .appendTo('#example_wrapper .col-md-6:eq(0)');

      console.log(data.json())

    })
  }
  fotos(x) {
    console.log(x)
    console.log(x.fotos)
    $("#test-modal-51").modal("show")

    this.lafoto = "./assets/auto.png"
    this.lamaquina = x
    this.lasfotos = x.fotos
  }
  quitarfoto() {
    var opcion = confirm("Esta seguro? Eliminara la foto!");
    if (opcion == true) {
      var index = this.lasfotos.indexOf(this.lafoto);
      if (index > -1) {
        this.lasfotos.splice(index, 1);
      }
      var p = {
        maquina: this.lamaquina,
        foto: this.lafoto
      }
      this.api.eliminarfoto(p).subscribe((data) => {
        console.log(data)
        this.lafoto = "./assets/auto.png"
      })
    } else {

    }
   

  }
}
