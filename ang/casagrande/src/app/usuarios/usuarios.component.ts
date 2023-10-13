import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PrincipalService } from '../servicio/principal.service'
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';

declare var $: any

declare var swal: any
declare var Swal: any
@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  lossecundarios: any = {}
  hola: any
  modul: any = [
    {
      nombre: "Activo Fijo",
      path: "/activoFijo",
      img: "assets/1.png",
      clase: "numero1",
      botones: [
        {
          modulo: "Activo Fijo",
          nombre: "Editar",
          funcion: "biened(row)"

        },
        {
          modulo: "Activo Fijo",
          nombre: "Eliminar",
          funcion: "eliminarb(row)"

        },
        {
          modulo: "Activo Fijo",
          nombre: "Ver",
          funcion: "eliminarb(row)"

        },
        {
          modulo: "Activo Fijo",
          nombre: "Agregar",
          funcion: "eliminarb(row)"

        }
      ]
    },
    {
      nombre: "Bienes",
      path: "/bienes_casagrande",
      img: "assets/biene.png",
      clase: "numero1",
      botones: [{
        modulo: "Bienes",
        nombre: "Encargados",
        funcion: "maquina(row)"

      },
      {
        modulo: "Bienes",
        nombre: "Editar",
        funcion: "biened(row)"

      },
      {
        modulo: "Bienes",
        nombre: "Eliminar",
        funcion: "eliminarb(row)"

      },
      {
        modulo: "Bienes",
        nombre: "Ver",
        funcion: "eliminarb(row)"

      },
      {
        modulo: "Bienes",
        nombre: "Agregar",
        funcion: "eliminarb(row)"

      }
      ]
    },
    {
      nombre: "CHECK LIST",
      path: "/check",
      img: "assets/7.png",
      clase: "numero1",
      botones: [{
        modulo: "CHECK LIST",
        nombre: "Cargar",
        funcion: "maquina(row)"

      },
      {
        modulo: "CHECK LIST",
        nombre: "Reporte",
        funcion: "biened(row)"

      }

      ]
    },
    {
      nombre: "Partes",
      path: "/partes_diario",
      img: "assets/11.png",
      clase: "numero2",
      botones: [{
        modulo: "Partes",
        nombre: "Generar Parte",
        funcion: "maquina(row)"

      },
      {
        modulo: "Partes",
        nombre: "Reporte de Parte",
        funcion: "partepersonal(row)"

      },
      {
        modulo: "Partes",
        nombre: "Agregar Costo",
        funcion: "agregarcosto(row)"

      },
      {
        modulo: "Partes",
        nombre: "Ver Costo",
        funcion: "vercosto(row)"

      },
      {
        modulo: "Partes",
        nombre: "Ver Costo Diesel",
        funcion: "vercostodiesel(row)"

      },
      {
        modulo: "Partes",
        nombre: "Descuentos",
        funcion: "descuentos(row)"

      },
      {
        modulo: "Partes",
        nombre: "Estadisticas",
        funcion: "descuentos(row)"

      },
      {
        modulo: "Partes",
        nombre: "Reportes",
        funcion: "descuentos(row)"

      },

      ]
    },
    {
      nombre: "Preventivo",
      path: "/preventivo_cg",
      img: "assets/preve.png",
      clase: "numero2",
      botones: [{
        modulo: "Preventivo",
        nombre: "Ver Prevenciones",
        funcion: "maquina(row)"

      }]
    },
    {
      nombre: "OD",
      path: "/ordenes_servicio",
      img: "assets/2.png",
      clase: "numero3",
      botones: [{
        modulo: "OD",
        nombre: "Generar OD",
        funcion: "maquina(row)"

      },
      {
        modulo: "OD",
        nombre: "Reporte OD",
        funcion: "biened(row)"

      }
        ,
      {
        modulo: "OD",
        nombre: "Cerrar OD",
        funcion: "biened(row)"

      }
        ,
      {
        modulo: "OD",
        nombre: "Aprobar OD",
        funcion: "biened(row)"

      }
      ]
    }, {
      nombre: "Solicitud",
      path: "/sol_com",
      img: "assets/3.png",
      clase: "numero4",
      botones: [{
        modulo: "Solicitud",
        nombre: "Generar Solicitud",
        funcion: "maquina(row)"

      },
      {
        modulo: "Solicitud",
        nombre: "Aprobar Solicitud",
        funcion: "biened(row)"

      },
      {
        modulo: "Solicitud",
        nombre: "Ver Todas las Solicitudes",
        funcion: "biened(row)"
      }
      ]
    }, {
      nombre: "Proyectos",
      path: "/proy_cg",
      img: "assets/4.png",
      clase: "numero5",
      botones: [{
        modulo: "Proyectos",
        nombre: "Generar Proyectos",
        funcion: "maquina(row)"

      },
      {
        modulo: "Proyectos",
        nombre: "Editar",
        funcion: "biened(row)"

      }
        ,
      {
        modulo: "Proyectos",
        nombre: "Eliminar",
        funcion: "biened(row)"

      }
      ]
    },
    {
      nombre: "Usuarios",
      path: "/usuarios",
      img: "assets/personas.png",
      clase: "numero9",
      botones: [{
        modulo: "Usuarios",
        nombre: "Permisos",
        funcion: "verpermisos(row)"

      },
      {
        modulo: "Usuarios",
        nombre: "Editar",
        funcion: "editarusuario(row)"

      },
      {
        modulo: "Usuarios",
        nombre: "Eliminar",
        funcion: "eliminarusuario(row)"

      },
      ]
    },
    {
      nombre: "Contabilidad",
      path: "/contabilidad",
      img: "assets/8.png",
      clase: "numero3",
      botones: [{
        modulo: "Contabilidad",
        nombre: "Permisos",
        funcion: "verpermisos(row)"

      },
      {
        modulo: "Contabilidad",
        nombre: "Editar",
        funcion: "editarusuario(row)"

      },
      {
        modulo: "Contabilidad",
        nombre: "Eliminar",
        funcion: "eliminarusuario(row)"

      },
      ]
    }

  ]
  miseleccion: any
  lospermitidos: any = []
  mismodulos: any = []
  elsujeto: any
  paraeliminar: any = ""



  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  selected = new FormControl(0);
  bien: any = {}
  permisos: any = []
  modulo: any
  valor: any
  al: boolean
  envio: any = {}
  displayedColumns: string[] = ['id', 'nombre', 'apaterno', 'amaterno', 'ci', 'telefono', 'username', 'acciones'];
  latabla: any = []
  ayuda: any
  botonpermisos1: boolean = false
  botonpermisos2: boolean = false
  actua: any
  actu: any = {}





  losproyectos: any = [{
    text: "Proyectos Casa Grande",
    children: [],

  }]
  misproyectos: any = []
  constructor(public api: PrincipalService, private router: Router, private cookieService: CookieService) { }

  applyFilter(filterValue: string) {
    this.latabla.filter = filterValue.trim().toLowerCase();

    if (this.latabla.paginator) {
      this.latabla.paginator.firstPage();
    }
  }
  verpermisos(x) {
    $("#data").jstree("destroy");
    this.losproyectos = [{
      text: "Proyectos Casa Grande",
      children: [],

    }]



    this.api.losproyectos().subscribe((data) => {
      console.log(data.json())
      var pr = data.json()
      for (var i = pr.length - 1; i >= 0; i--) {
        var cot = {
          text: pr[i].nombre + " " + pr[i].codigo,
          children: [],
          id: "Proyecto" + "-" + pr[i].descripcion,
        }
        this.losproyectos[0].children.push(cot)
      }


      $('#data1').jstree({
        'core': {
          'data': this.losproyectos
        },
        'checkbox': {
          "keep_selected_style": false,
          three_state: true, cascade: 'up'
        },
        'plugins': ["checkbox"]
      });
    })



    this.actua = x
    this.elsujeto = x._id
    this.miseleccion = []
    this.lospermitidos = []
    this.paraeliminar = ""
    this.mismodulos = []
    this.permisos = x.permisos



    var o = {
      id: this.elsujeto
    }

    this.api.verpermisos(o).subscribe((data) => {
      var total: any = []

      for (var i1 = this.modul.length - 1; i1 >= 0; i1--) {
        var auxiliar: any = {
          text: this.modul[i1].nombre,
          children: [],
          id: "Modulo" + "-" + this.modul[i1].nombre,
          path: this.modul[i1].path,
          img: this.modul[i1].img,
          clase: this.modul[i1].clase,
        }
        for (var i2 = this.modul[i1].botones.length - 1; i2 >= 0; i2--) {
          auxiliar.children.push({ text: this.modul[i1].botones[i2].nombre, icon: "jstree-file", id: this.modul[i1].botones[i2].modulo + "-" + this.modul[i1].botones[i2].nombre })
        }
        total.push(auxiliar)
      }

      var archivos = data.json()
      //analisis

      for (var i3 = total.length - 1; i3 >= 0; i3--) {

        for (var i4 = archivos.length - 1; i4 >= 0; i4--) {



          if (total[i3].text == archivos[i4].nombre) {

            for (var i5 = total[i3].children.length - 1; i5 >= 0; i5--) {

              for (var i6 = archivos[i4].botones.length - 1; i6 >= 0; i6--) {
                if (total[i3].children[i5].text == archivos[i4].botones[i6].nombre) {
                  if (archivos[i4].botones[i6].estado == true) {
                    total[i3].children[i5].state = { "selected": true }
                  }

                }

              }


            }
            //total[i3].state= { "selected" : true }
          }

        }


      }




      var w = data.json()
      var wr = []
      var wi = []
      var arbol = []
      for (var i = w.length - 1; i >= 0; i--) {
        if (w[i].verificacion == true) {
          for (var ir = this.modul.length - 1; ir >= 0; ir--) {
            if (this.modul[ir].path == w[i].path) {
              wi.push(this.modul[ir])
            }
          }
          wr.push(w[i].nombre)

        }
      }
      for (var ix = wi.length - 1; ix >= 0; ix--) {
        var aux: any = {
          text: wi[ix].nombre,
          children: [],
          id: "Modulo" + "-" + wi[ix].nombre,
          path: wi[ix].path,
          img: wi[ix].img,
          clase: wi[ix].clase,
        }
        for (var iy = wi[ix].botones.length - 1; iy >= 0; iy--) {
          aux.children.push({ text: wi[ix].botones[iy].nombre, icon: "jstree-file", id: wi[ix].botones[iy].modulo + "-" + wi[ix].botones[iy].nombre })
        }
        arbol.push(aux)
      }


      $('#data').jstree({
        'core': {
          'data': total
        },
        'checkbox': {
          "keep_selected_style": false,
          three_state: true, cascade: 'up'
        },
        'plugins': ["checkbox"]
      });
      $("#data").bind("changed.jstree",
        function (e, data) {
          console.log(data)
          //alert("Checked: " + data.node.id);
          //alert("Parent: " + data.node.parent); 
          //alert(JSON.stringify(data));
        });

      this.mismodulos = wi
      this.lospermitidos = wr
    })



  }
  actperm() {
    this.api.actupermi(this.actua).subscribe((data) => {
      console.log(data)
    })
  }
  nuevopermi() {
    this.al = false
    this.permisos = []
    this.botonpermisos2 = true
    this.botonpermisos1 = false
  }
  editarusuario(x) {
    this.actu = x
  }
  eliminarusuario(x) {
    var opcion = confirm("Esta seguro? Eliminara al usuario");
    if (opcion == true) {
      this.api.eliminarusuario(x).subscribe((data) => {
        this.ngOnInit()
        alert(
          'Eliminado!'
         
        )
      })
    } else {

    }
   

  }
  actualizaciondeusuarios() {
    var opcion = confirm("Esta seguro? Se actualizaran los registros");
    if (opcion == true) {
      var x = {
        ayuda: {
          _id: this.actu._id,
          nombre: this.actu.nombre,
          apaterno: this.actu.apaterno,
          amaterno: this.actu.materno,
          ci: this.actu.ci,
          telefono: this.actu.telefono,
          username: this.actu.username,

        },
        pass: this.actu.pass

      }
      this.api.usuarioactu(x).subscribe((data) => {
        $('#test-modal-3').modal('hide');
        alert(
          'Termino!'
        )
        this.ngOnInit()
      })

    } else {

    }
   
  }
  ngOnInit() {


    this.api.usuariover().subscribe((data) => {
      this.ayuda = data.json()
      console.log(data.json())
      this.latabla = new MatTableDataSource(this.ayuda);
      this.latabla.paginator = this.paginator;
      this.latabla.sort = this.sort;

    })
  }
  terminar() {


    this.envio = this.bien
    this.envio.permisos = this.permisos
    console.log(this.envio)
    this.api.usuariocrear(this.envio).subscribe((data) => {
      console.log(data)
      this.envio = {}
      this.bien = {}
      this.permisos = []
      alert(
        'Exito!'
      )
      this.ngOnInit()
      this.selected.setValue(0)
    })

  }

  adicion() {

    var y = 0
    for (var ii = this.lospermitidos.length - 1; ii >= 0; ii--) {
      if (this.miseleccion[0].nombre == this.lospermitidos[ii]) {
        y = 1
        console.log("entre")
      }
    }
    if (y == 0) {
      this.miseleccion[0].verificacion = true
      this.miseleccion[0].usuario = this.elsujeto
      this.lospermitidos.push(this.miseleccion[0].nombre)
      this.mismodulos.push(this.miseleccion[0])
    } else {
      alert("Atención! El modulo ya se introdujo")
    }

  }
  adicionar() {
    console.log(this.modulo)
    for (var i = this.modulo.length - 1; i >= 0; i--) {
      var ayuda = 0
      for (var ii = this.permisos.length - 1; ii >= 0; ii--) {
        if (this.permisos[ii].modulo == this.modulo[i]) {
          ayuda = 1
        }
      }
      if (ayuda != 1) {
        this.permisos.push({
          modulo: this.modulo[i],
          ver: false,
          crear: false,
          editar: false,
          eliminar: false
        })

      } else {
        alert("Atención! El modulo " + this.modulo[i] + " ya se introdujo")
      }



    }
  }
  quitar(x) {
    var busqueda = this.permisos.indexOf(x)
    if (busqueda > -1) {
      this.permisos.splice(busqueda, 1);
    }
  }
  perm() {
    console.log(this.permisos)
  }
  todo(x) {
    for (var i = this.permisos.length - 1; i >= 0; i--) {
      if (this.permisos[i].modulo == x.modulo) {
        this.permisos[i].ver = !this.permisos[i].valor
        this.permisos[i].crear = !this.permisos[i].valor
        this.permisos[i].editar = !this.permisos[i].valor
        this.permisos[i].eliminar = !this.permisos[i].valor

      }
    }
  }
  all() {
    for (var i = this.permisos.length - 1; i >= 0; i--) {

      this.permisos[i].ver = !this.al
      this.permisos[i].crear = !this.al
      this.permisos[i].editar = !this.al
      this.permisos[i].eliminar = !this.al


    }
  }
  darpermisos() {


    var instance = $('#data').jstree(true);
    var ar = instance._model.data
    console.log(ar)
    var armar = []
    var armado2 = []
    var sitiene = []
    var verdar: any = {}
    $.each(ar, (key, value) => {
      var r = value
      var rr = r.id.split("-");

      var estruc: any = {}
      var segundaestruc: any = {}
      if (r.id != '#') {
        if (rr[0] != "Modulo") {
          estruc.modulo = rr[0],
            estruc.usuario = this.elsujeto,
            estruc.nombre = r.text,
            estruc.estado = r.state.selected
          armar.push(estruc)
          if (r.state.selected == true) {
            verdar.modulo = rr[0]
            verdar.tiene = "si"

            sitiene.push(JSON.stringify(verdar))
          }
        }

      }


    });
    var perfecto: any = {}
    var lalista: any = []
    let sinRepetidos = sitiene.filter((valor, indiceActual, arreglo) => arreglo.indexOf(valor) === indiceActual);
    for (var f = 0; f < sinRepetidos.length; ++f) {
      sinRepetidos[f] = JSON.parse(sinRepetidos[f])
    }
    console.log(sinRepetidos)
    for (var q = 0; q < sinRepetidos.length; ++q) {
      for (var qq = 0; qq < this.modul.length; ++qq) {
        if (sinRepetidos[q].modulo == this.modul[qq].nombre) {
          perfecto.nombre = this.modul[qq].nombre
          perfecto.path = this.modul[qq].path
          perfecto.clase = this.modul[qq].clase
          perfecto.img = this.modul[qq].img
          perfecto.usuario = this.elsujeto
          perfecto.verificacion = true
          perfecto.botones = []
          lalista.push(JSON.stringify(perfecto))
        }
      }
    }

    for (var i = lalista.length - 1; i >= 0; i--) {
      lalista[i] = JSON.parse(lalista[i])
    }

    var miayuda: any = {}
    for (var is = lalista.length - 1; is >= 0; is--) {
      for (var e = 0; e < armar.length; ++e) {
        if (lalista[is].nombre == armar[e].modulo) {
          miayuda.nombre = armar[e].nombre,
            miayuda.estado = armar[e].estado
          lalista[is].botones.push(JSON.stringify(miayuda))
        }
      }
    }

    console.log(lalista)




    this.api.subirpermisos(lalista).subscribe((data) => {
      alert("Se actualizo!");
      $('#tee8').modal('hide');
    })
  }

  resta() {
    var index = this.lospermitidos.indexOf(this.paraeliminar[0]);
    if (index > -1) {
      this.lospermitidos.splice(index, 1);
    }
    for (var i = this.mismodulos.length - 1; i >= 0; i--) {
      if (this.mismodulos[i].nombre == this.paraeliminar[0]) {
        this.mismodulos[i].verificacion = false
      }
    }

  }
  cambio() {
    console.log(this.lossecundarios)
  }
  otorgarpermiso() {
    for (var i = this.modul.length - 1; i >= 0; i--) {
      if (this.modul[i].nombre == this.paraeliminar[0]) {
        this.lossecundarios = this.modul[i]
      }
    }
  }
}
