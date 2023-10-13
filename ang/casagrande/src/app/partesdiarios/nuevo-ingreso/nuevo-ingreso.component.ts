import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PrincipalService } from 'src/app/servicio/principal.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CookieService } from 'ngx-cookie-service';

declare var swal: any;


@Component({
  selector: 'app-nuevo-ingreso',
  templateUrl: './nuevo-ingreso.component.html',
  styleUrls: ['./nuevo-ingreso.component.css'],
  providers: [DatePipe]
})
export class NuevoIngresoComponent implements OnInit {
  fechaactual: any = new Date();
  dropdownList1 = [];
  selectedItems1 = [];
  dropdownSettings1 = {};
  selectedItems = [];


  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  displayedColumns: string[] = ['nombre', 'codigo', 'codigoEmpresa', 'descripcion', 'marca', 'estado', 'tipo', 'posicion', 'acciones'];

  @ViewChild(MatPaginator, { static: true }) paginator1: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort1: MatSort;
  displayedColumns1: string[] = ['nombre', 'codigo', 'codigoEmpresa', 'descripcion',
    'marca', 'estado', 'acciones'];
  latabla1: any;

  fecha = new Date();
  datos: any;
  item: any = {};
  latabla: any;
  ayuda: any;
  losp: any = [];
  constructor(
    public dialogRef: MatDialogRef<NuevoIngresoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public gServicio: PrincipalService,
    public dialog: MatDialog,
    private datePipe: DatePipe,
    private cookieService: CookieService
  ) {
    this.datos = data.bien;
    console.log(this.datos)
  }


  ngOnInit() {
    this.gServicio.losproyectos().subscribe((data) => {
      this.multiselect1(data.json());
    })
  }
  // REGISTRAR
  onSubmit() {
    this.item.proyecto = this.selectedItems1[0].value;
    this.item.bien = this.datos._id;


    this.gServicio.agregarOtroIngreso(this.item).subscribe((respuesta) => {
      console.log(respuesta);
      this.dialogRef.close(true);
      alert('Gracias se cargo correctamente!');
    });




    console.log(this.item);
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
  // CERRAR VENTANA
  onNoClick(): void {
    this.dialogRef.close(false);
  }
}
