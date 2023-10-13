import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { CookieService } from 'ngx-cookie-service';
import { PrincipalService } from '../servicio/principal.service';
declare var Tabulator: any;

@Component({
  selector: 'app-nuevo-parte-diario',
  templateUrl: './nuevo-parte-diario.component.html',
  styleUrls: ['./nuevo-parte-diario.component.css']
})
export class NuevoParteDiarioComponent implements OnInit {
  itemsbienes1: any = []
  order: any
  maquina: any = {}
  tablett: any;
  data: any = []
  dataEditor: any = function (cell, onRendered, success, cancel) {
    //cell - the cell component for the editable cell
    //onRendered - function to call when the editor has been rendered
    //success - function to call to pass the successfuly updated value to Tabulator
    //cancel - function to call to abort the edit and return to a normal cell

    //create and style input
    var cellValue = moment(cell.getValue(), "YYYY-MM-DD").format("YYYY-MM-DD"),
      input = document.createElement("input");

    input.setAttribute("type", "date");

    input.style.padding = "4px";
    input.style.width = "100%";
    input.style.boxSizing = "border-box";

    input.value = cellValue;

    onRendered(function () {
      input.focus();
      input.style.height = "100%";
    });

    function onChange() {
      if (input.value != cellValue) {
        success(moment(input.value, "YYYY-MM-DD").format("YYYY-MM-DD"));
      } else {
        cancel();
      }
    }

    //submit new value on blur or change
    input.addEventListener("blur", onChange);

    //submit new value on enter
    input.addEventListener("keydown", function (e) {
      if (e.keyCode == 13) {
        onChange();
      }

      if (e.keyCode == 27) {
        cancel();
      }
    });

    return input;
  };

  cabecera: any = [
    { title: 'Numerador', field: 'numerador', hozAlign: "center", width: 140 },
    { title: 'Fecha', field: 'fecha', hozAlign: "center", sorter: "date", width: 140, editor: this.dataEditor },
    { title: 'Afectar Maquina', field: 'afecto', editor: "select", editorParams: { values: { true: "Si", "falso": "No" } }, width: 140 },
    { title: 'Proyecto', field: 'proyectoName', width: 140, editor: "select", editorParams: { values: [{ label: "Proyectos", options: this.itemsbienes1 }] } },
    { title: 'Maquina', field: 'nombre', width: 140 },
    { title: 'Usuario', field: 'usuario', width: 140 },
    { title: 'Operador', field: 'operadormaquina', editor: "input", width: 140 },
    { title: 'MetodoPago', field: 'metododepago', editor: "select", width: 140 },
    { title: 'HorometroActual', field: 'horometroactual', width: 140 },
    { title: 'HorometroNuevo', field: 'horometronuevo', editor: "input", width: 140 },
    { title: 'Habiles', field: 'habiles', editor: "input", width: 140 },
    { title: 'Dia', field: 'dia', editor: "input" },
    { title: 'Observaciones', field: 'observaciones', editor: "input", width: 140 },
    { title: 'Numero Parte', field: 'codigo', editor: "input", width: 140 },
    { title: 'Nulas', field: 'nulas', editor: "input", width: 140 },
    { title: 'Viajes', field: 'viajes', editor: "input", width: 140 },
    { title: 'Cubos', field: 'cubos', editor: "input", width: 140 },
    { title: 'Arena', field: 'arena', editor: "input", width: 140 },
    { title: 'Ripio', field: 'ripio', editor: "input", width: 140 },
    { title: 'Gravilla', field: 'gravilla', editor: "input", width: 140 },
    { title: 'Piedra', field: 'piedra', editor: "input", width: 140 },
    { title: 'Descarte', field: 'descarte', editor: "input", width: 140 },
    { title: 'Grava', field: 'grava', editor: "input", width: 140 },
    { title: 'Basura', field: 'basura', editor: "input", width: 140 },
    { title: 'KM', field: 'km', editor: "input", width: 140 },
    { title: 'Traslado', field: 'traslado', editor: "input", width: 140 },
    { title: 'Otro', field: 'otro', editor: "input", width: 140 },
    { title: 'Diesel', field: 'diesel', editor: "input", width: 140 },
    { title: 'Diesel Pagado', field: 'dieselpagado', editor: "input", width: 140 },
    { title: 'Aceite de Motor', field: 'aceitemotor', editor: "input", width: 140 },
    { title: 'Grasa', field: 'grasa', editor: "input", width: 140 },
    { title: 'Liquido de Freno', field: 'liquidofreno', editor: "input", width: 140 },
    { title: 'Gasolina', field: 'gasolina', editor: "input", width: 140 },
    { title: 'Aceite Hidraulico', field: 'aceitehidraulico', editor: "input", width: 140 },

    { title: 'Aceite Trasmision', field: 'aceitetransmision', editor: "input", width: 140 },

    { title: 'Filtro Aceite', field: 'filtroaceite', editor: "input", width: 140 },
    { title: 'Filtro Combustible Hidraulico', field: 'filtrocombustible', editor: "input", width: 140 },
    { title: 'Agua Destilada', field: 'aguadestilada', editor: "input", width: 140 }
  ];


  constructor(public api: PrincipalService, private router: Router, private route: ActivatedRoute, private cookieService: CookieService) { }

  ngOnInit() {


    this.route.queryParams
      .subscribe(params => {
        console.log(params); // { order: "popular" }

        this.maquina = JSON.parse(params.param);
        console.log(this.maquina) // popular
        this.data = this.maquina
        this.data.forEach((element, index) => {
          element.numerador = index
        });

      }
      );


    this.api.proyectoslista().subscribe((data) => {
      console.log(data.json())
      this.multiproyectos(data.json())
      console.log(this.itemsbienes1)

      console.log(this.itemsbienes1)

    })

  }



  nuevo() {
    var selectedData = this.tablett.getSelectedData();
    console.log(this.tablett.getRows())
    console.log(this.tablett.getRow(1))
    this.tablett.deleteRow(0)
    this.tablett.deleteRow(1)
    selectedData.forEach(element => {
      console.log(element)

    });
    console.log(selectedData)
  }

  multiproyectos(x) {
    this.itemsbienes1 = []
    var y = {}
    for (var i = x.length - 1; i >= 0; i--) {





      y = {

        "label": x[i].codigo + " " + x[i].nombre,
        "value": x[i]._id
      }
      this.itemsbienes1.push(y)
    }


    this.tablett = new Tabulator('#example-table', {
      data: this.data,
      selectable: true,
      printAsHtml: true,
      pagination: 'local',
      layout: 'fitColumns',
      paginationSize: 50,
      paginationSizeSelector: [10, 50, 100, 200],
      movableColumns: true,
      printConfig: {
        columnGroups: true,
        rowGroups: true,
        columnCalcs: true,
      },
      columns: this.cabecera,
      rowSelectionChanged: function (data, rows) {
        //update selected row counter on selection change
        document.getElementById("select-stats").innerHTML = data.length;
      },
    });
    console.log(this.itemsbienes1)
  }

  cargarPartes() {
    var data: any = this.tablett.getData();
    var rowCount = this.tablett.getDataCount();
    var selectedRows = this.tablett.getSelectedRows();

    var selectedData = this.tablett.getSelectedData();
    console.log(selectedData, selectedRows, data, rowCount)
    var r = confirm("Guardar todos los partes!");
    if (r == true) {
     /*this.api.descargarPartes(data).subscribe((data) => {
        alert("Se termino con exito")
      })*/

    } else {

    }
  }


}
