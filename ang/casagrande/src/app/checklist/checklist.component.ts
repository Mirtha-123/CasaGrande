import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PrincipalService } from '../servicio/principal.service'
import { FormControl } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { FileUploader } from 'ng2-file-upload';
import { ReporteComponent } from './reporte/reporte.component';
import { MatDialog } from '@angular/material';
import { NgWhiteboardService } from 'ng-whiteboard';
import { I18nInterface } from 'ngx-image-drawing';
import { saveAs } from 'file-saver';
import { Imagen1Component } from './imagen1/imagen1.component';
import { Imagen2Component } from './imagen2/imagen2.component';
import { Imagen3Component } from './imagen3/imagen3.component';
import { Imagen4Component } from './imagen4/imagen4.component';

const URL = 'https://localhost:3000/api/upload';


declare var $: any
declare var swal: any
declare var Swal: any
declare var XLSX: any
declare var html2canvas: any;
@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.component.html',
  styleUrls: ['./checklist.component.css'],
  providers: [NgWhiteboardService]
})
export class ChecklistComponent implements OnInit {
  @ViewChild('screen', { static: true }) screen: ElementRef;
  @ViewChild('canvas', { static: true }) canvas: ElementRef;
  @ViewChild('downloadLink', { static: true }) downloadLink: ElementRef;
  bb: any = {}
  mas: any = {
    motivo: '',
  }
  tqq: any = {}
  ri: any
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  displayedColumns: string[] = ['semaforizacion', 'codigo', 'nombre', 'descripcion', 'horometro', 'hodometro', 'estado', 'acciones'];

  mispermitidos: any = {
    crear: false,
    reporte: false
  }
  ayuda: any;
  latabla: any = [];
  check: any = [
    {
      id: 'Motor',
      sub: 'Sistema_de_Motor',
      item: [
        'Encedido de Motor',
        'Funcionamiento de motor',
        'Guardas y cubiertas protectoras',
        'Respiradero de Carter',
        'Dumper del Cigüeñal',
        'Tapa de llenado de aceite de Motor',
        'Filtro de aceite de Motor',
        'Estado de Mangueras y Cañerias',
        'Fugas de aceite de Motor',
        'Varilla de medición de nivel de aceite',
        'Nivel de aceite',
        'Soportes de Motor',
        'RPM alta en vacio',
        'RPM en minimo'
      ]
    },
    {
      id: 'admision',
      sub: 'Sistema_de_Admisión_y_escape',
      item: [
        'Filtro de aire Primario',
        'Filtro de aire Secundario',
        'Pre filtro de aire',
        'Turbo alimentador y líneas de lubricación',
        'Indicador de restricción de aire',
        'Tuberías de múltiple de admisión',
        'Tuberías de múltiple de escape',
        'Abrazaderas de ajuste líneas de admisión',
        'Soportes de tuberías de escape',
        'Color de los gases del escape',
        'Fugas de gases de escape',
        'Sileciador',
      ]
    },

    {
      id: 'combustible',
      sub: 'Sistema_de_Combustible',
      item: [
        'Cañerias y conexiones',
        'Presión del sistema de combustible',
        'Bomba de inyección (Rotativa)',
        'Inyectores',
        'Bomba de cabado y/o transferencia',
        'Filtro de combustible',
        'Fugas de combustible',
        'Tapa de tanque de combustible',
        'Válvula de drenaje',
        'Contaminación del tanque',

      ]
    },
    {
      id: 'refrigeracion',
      sub: 'Sistema_de_Refrigeración',
      item: [
        'Radiador (Limpieza de Panal)',
        'Ventilador',
        'Nivel de liquido refrigerante',
        'Correa de ventilador',
        'Termostato',
        'Indicador de temperatura',
        'Bomba de agua o refrigerante',
        'Enfriador de aceite de motor',
        'Tapa de radiador',
        'Estado de mangueras de radiador y enfriador',
        'Fugas de refrigerante',
        'Embudo de radiador',
        'Soportes de radiador'

      ]
    },
    {
      id: 'electronico',
      sub: 'Sistema_Electrico_Electronico',
      item: [
        'Alternador',
        'Baterías y bornes',
        'Cables de baterías',
        'Voltímetro',
        'Amperímetro de carga',
        'Regulador de voltaje',
        'Faros y luces en general',
        'Alarma de retroceso',
        'Motor de arranque',
        'Bocina',
        'Chapa de contaco y arranque',
        'Switch de corte de energía'

      ]
    },
    {
      id: 'transmisión',
      sub: 'Sistema_de_Transmisión',
      item: [
        'Nivel de aceite de transmisión (Convertidor y caja)',
        'Filtro de transmisión',
        'Nivel de aceite de diferencial trasero',
        'Nivel de aceite de diferencial delantero',
        'Nivel de aceite de mando final trasero izquierdo',
        'Nivel de aceite de mando final trasero derecho',
        'Nivel de aceite de mando final delantero izquierdo',
        'Nivel de aceite de mando final delantero derecho',
        'Fugas de aceites',
        'Cardanes',
        'Crucetas',
        'Soportes de cardan'
      ]
    },
    {
      id: 'hidraulico',
      sub: 'Sistema_Hidraulico',
      item: [
        'Cilindros hidráulicos',
        'Fugas externas de cilindros hidráulicos',
        'Estado de mangueras',
        'Estado de acoples',
        'Nivel de aceite Hidráulico',
        'Estado de vástagos',
        'Estado de cañerías',
        'Fugas de aceite',
        'Bomba hidráulica',
        'Visor de nivel del tanque',
        'Enfriador de aceite hidráulico',
        'Filtros hidráulicos'

      ]
    },
    {
      id: 'imple',
      sub: 'Implementos_de_Seguridad_Herramientas',
      item: [
        'Bulldozer',
        'Riper',
        'Hoja de vertedera',
        'Cuchillas y/o uñas',
        'Porcentaje de desgaste de cuchillas y/o uñas',
        'Cantoneras',
        'Porcentaje de desgaste de cantoneras',
        'Boom',
        'Estado de pines y link de brazos',
        'Cucharon',
        'Porcentaje de desgaste de cucharon',
        'Stick',
        'Bujes y pasadores'
      ]
    },

    {
      id: 'chasis',
      sub: 'Chasis_Bastidor_Principal',
      item: [
        'Chasis Principal',

      ]
    },
    {
      id: 'general',
      sub: 'Estado_General_del_Equipo',
      item: [
        'Estado general del equipo (chapa y pintura)',

      ]
    },
    {
      id: 'rodamiento',
      sub: 'Sistema_de_rodamiento',
      item: [
        'Porcentaje de desgaste de neumáticos',
        'Rodillo',
        'Desgaste porcentual del rodillo',
        'Tren de rodado (cadenas)',
        'Porcentaje de desgaste del tren de rodado'
      ]
    },

    {
      id: 'frenos',
      sub: 'Sistema_de_Frenos_Bloqueador',
      item: [
        'Nivel de liquido de frenos',
        'Tapa de deposito de liquido de freno',
        'Balatas y/o pastillas',
        'Discos y/o tambores de freno',
        'Bloqueador',
        'Válvula de bloqueador',
        'Compresora de aire',
        'Drenador de tanque de aire'
      ]
    },
    {
      id: 'cabina',
      sub: 'Cabina_del_Operador',
      item: [
        'Panel de instrumentos e indicadores',
        'Horometro',
        'Consola de programación y control',
        'Asiento de operador',
        'Aire acondicionado',
        'Luces de cabina',
        'Espejos',
        'Cinto de Seguridad',
        'Parabrisas',
        'LimpiaParabrisas',
        'Para Soles',
        'Estribos de acceso a la cabina',
        'Pedales de freno y/o acelerador',
        'Pisos',
        'Tapiz de puertas',
        'Chapas y manijas de puertas',
        'Vidrios de cabina',
        'Vidrios de puertas',
        'Bisagras de puertas',
        'Control de freno de parqueo (perilla o palanca)',
        'Control de mando y/o joystick',
        'Gomas de puertas',
        'Radio AM/FM',
        'Antena de comunicación de datos',
        'Antena de sintonización AM/FM'
      ]
    },
    {
      id: 'accesorios',
      sub: 'Accesorios_y_Herramientas',
      item: [
        'LLave de corte de energía',
        'Llave de contacto',
        'Extintor',
        'Botiquin',
        'Grasera',
        'Juego de llaves',
        'Alicate',
        'Desarmadores',
        'LLave crecen',
        'Combo',
        'Manual de operación'
      ]
    },



  ]
  losname: any = []
  public i18n: I18nInterface = {
    saveBtn: 'Save the image as JPEG !',
    sizes: {
      extra: 'Extra'
    }
  };
  fotito: any;
  lasfotos: any = [];
  public uploader: FileUploader = new FileUploader({ url: URL, itemAlias: 'photo' });

  constructor(
    public api: PrincipalService,
    public dialog: MatDialog,
    private router: Router,
    private cookieService: CookieService,
    private whiteboardService: NgWhiteboardService
  ) { }

  public saveBtn($event) {
    console.log($event);

    saveAs($event, 'image.jpg');

  }
  nivelCombustible() {
    const dialogRef = this.dialog.open(Imagen1Component, {
      width: '70%',
      height: '70%',
      data: {
        bien: this.bb,
      },
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('RESULTADO', result);
        this.mas.combustibleUrl = result.success.secure_url;

      }
    });
  }

  nivelNeumaticos() {
    const dialogRef = this.dialog.open(Imagen2Component, {
      width: '70%',
      height: '70%',
      data: {
        bien: this.bb,
      },
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('RESULTADO', result);
        this.mas.neumaticoUrl = result.success.secure_url;

      }
    });
  }

  nivelRodillo() {
    const dialogRef = this.dialog.open(Imagen3Component, {
      width: '70%',
      height: '70%',
      data: {
        bien: this.bb,
      },
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('RESULTADO', result);
        this.mas.rodilloUrl = result.success.secure_url;

      }
    });
  }
  nivelRodado() {
    const dialogRef = this.dialog.open(Imagen4Component, {
      width: '70%',
      height: '70%',
      data: {
        bien: this.bb,
      },
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('RESULTADO', result);
        this.mas.rodadoUrl = result.success.secure_url;

      }
    });
  }
  cancel() {

  }

  checkq(x) {
    console.log(x);
    this.bb = x

    this.whiteboardService.addImage('./assets/combustible.png');

  }
  guardarcheck() {

    console.log(this.mas);
    var nose = []
    console.log(this.losname)
    for (var i = this.losname.length - 1; i >= 0; i--) {
      var x
      if ($('input[name=' + this.losname[i].nn + ']:checked').val() == undefined) {
        x = {
          valor: "",
          name: this.losname[i].nombre,
          padre: this.losname[i].nn,
          sub: this.losname[i].sub
        }
      } else {
        x = {
          valor: $('input[name=' + this.losname[i].nn + ']:checked').val(),
          name: this.losname[i].nombre,
          sub: this.losname[i].sub
        }
      }

      nose.push(x)
    }
    this.mas.maquina = this.bb._id
    this.mas.usuario = this.cookieService.get('cokidemiproyecto');
    var y = {
      detal: nose,
      check: this.mas
    }
    console.log(y);
    /* this.api.guardarche(y).subscribe((data) => {
       swal("Se agrego correctamente!", "Finalizar!", "success");
     });*/
  }
  applyFilter(filterValue: string) {
    this.latabla.filter = filterValue.trim().toLowerCase();

    if (this.latabla.paginator) {
      this.latabla.paginator.firstPage();
    }
  }
  ngOnInit() {


    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      console.log('ImageUpload:uploaded:', item, status, response);

      var x = JSON.parse(response)
      this.fotito = x.success.secure_url
      console.log(x)
      var p = {
        fotito: this.fotito,
        datos: this.bb
      }

      this.api.lafotito(p).subscribe((data) => {
        this.lasfotos.push(x.success.secure_url)
        alert("Gracias se cargo correctamente!");
      })


    };







    $("#ee").on('click', () => {
      var x = []
      for (var i = this.check.length - 1; i >= 0; i--) {
        var y: any = {}
        for (var ix = this.check[i].item.length - 1; ix >= 0; ix--) {
          eval("y." + this.check[i].id + ix + "=" + this.check[i].item[ix])


        }
        x.push(y)
      }
      console.log(x)
    })

    for (var i = 0; i <= this.check.length - 1; i++) {
      $(".esto").append(`<div class="${this.check[i].id}">
          <h3>${this.check[i].sub}</h3>

        </div> `)
      for (var iz = 0; iz <= this.check[i].item.length - 1; iz++) {
        this.losname.push({ nn: this.check[i].id + iz, nombre: this.check[i].item[iz], sub: this.check[i].sub });
        $("." + this.check[i].id).append(`

 <div class="col-md-12">
                             <label>${this.check[i].item[iz]}</label>
                          </div>
                          <div class="col-md-12">
                             <div class="custom-control custom-radio custom-control-inline">
  <input type="radio" id="${this.check[i].sub + iz + '1'}"  value="OK"   name="${this.check[i].id + iz}" class="custom-control-input">
  <label class="custom-control-label" for="${this.check[i].sub + iz + '1'}">OK</label>
</div>
<div class="custom-control custom-radio custom-control-inline">
  <input type="radio" id="${this.check[i].sub + iz + '2'}" value="D" name="${this.check[i].id + iz}" class="custom-control-input">
  <label class="custom-control-label" for="${this.check[i].sub + iz + '2'}">D</label>
</div>
<div class="custom-control custom-radio custom-control-inline">
  <input type="radio" id="${this.check[i].sub + iz + '3'}" value="RE"  name="${this.check[i].id + iz}" class="custom-control-input">
  <label class="custom-control-label" for="${this.check[i].sub + iz + '3'}">RE</label>
</div>
<div class="custom-control custom-radio custom-control-inline">
  <input type="radio" id="${this.check[i].sub + iz + '4'}" value="F"  name="${this.check[i].id + iz}" class="custom-control-input">
  <label class="custom-control-label" for="${this.check[i].sub + iz + '4'}">F</label>
</div>
<div class="custom-control custom-radio custom-control-inline">
  <input type="radio" id="${this.check[i].sub + iz + '5'}"  value="N/A" name="${this.check[i].id + iz}" class="custom-control-input">
  <label class="custom-control-label" for="${this.check[i].sub + iz + '5'}">N/A</label>
</div>
<div class="form-group">
                <label for="exampleFormControlInput1">Observaciones</label>
                <input type="text" class="form-control" name="${this.check[i].id + iz}"  id="${this.check[i].sub + iz + '6'}">
              </div>
                          </div>










          `)
      }


    }





    var x = {
      id: this.cookieService.get('cokidemiproyecto'),
      modulo: "CHECK LIST"
    }
    this.api.mispermisos(x).subscribe((dataa) => {
      var expresion = dataa.json().botones

      for (var i = expresion.length - 1; i >= 0; i--) {
        if (expresion[i].nombre == "Cargar" && expresion[i].estado == true) {
          this.mispermitidos.crear = true
        }
        if (expresion[i].nombre == "Reporte" && expresion[i].estado == true) {
          this.mispermitidos.reporte = true
        }

      }
      this.api.bienes().subscribe((data) => {
        this.ayuda = data.json()
        console.log(data.json())
        this.latabla = new MatTableDataSource(this.ayuda);
        this.latabla.paginator = this.paginator;
        this.latabla.sort = this.sort;

      })



    })
  }
  exportImagen(x) {
    console.log(x);
  }
  processError(x) {
    console.log(x);
  }
  reporte(x) {
    const dialogRef = this.dialog.open(ReporteComponent, {
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

}
