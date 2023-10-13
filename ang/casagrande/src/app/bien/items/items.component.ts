import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PrincipalService } from 'src/app/servicio/principal.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TransferirComponent } from '../transferir/transferir.component';
import { ItemsFormularioComponent } from '../items-formulario/items-formulario.component';
import { CookieService } from 'ngx-cookie-service';

declare var swal: any;

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css'],
  providers: [DatePipe]
})
export class ItemsComponent implements OnInit {

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
  constructor(
    public dialogRef: MatDialogRef<ItemsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public gServicio: PrincipalService,
    public dialog: MatDialog,
    private datePipe: DatePipe,
    private cookieService: CookieService
  ) {
    this.datos = data;
  }

  ngOnInit() {
    console.log(this.datos);
    this.obtenerItems();
    this.misitems();
  }


  applyFilter(filterValue: string) {
    this.latabla.filter = filterValue.trim().toLowerCase();

    if (this.latabla.paginator) {
      this.latabla.paginator.firstPage();
    }
  }
  applyFilter1(filterValue: string) {
    this.latabla1.filter = filterValue.trim().toLowerCase();

    if (this.latabla1.paginator) {
      this.latabla1.paginator.firstPage();
    }
  }

  misitems() {
    this.gServicio.itemMio(this.datos).subscribe((respuesta) => {
      console.log(respuesta.json());
      this.latabla1 = new MatTableDataSource(respuesta.json());
      this.latabla1.paginator = this.paginator1;
      this.latabla1.sort = this.sort1;
    });
  }
  obtenerItems() {
    this.gServicio.itemLista().subscribe((data) => {
      this.ayuda = data.json();
      console.log(data.json());
      this.latabla = new MatTableDataSource(this.ayuda);
      this.latabla.paginator = this.paginator;
      this.latabla.sort = this.sort;
    });
  }

  agregarItem(row) {
    const x = {
      item: row,
      bien: this.datos.bien
    };

    var opcion = confirm("Desea Relacionar este item con la maquina?");
    if (opcion == true) {
      this.gServicio.adicionarItem(x).subscribe((respuesta) => {
        console.log(respuesta);
      });
    } else {

    }


    console.log(row);
    console.log(this.datos);
  }
  editar(x) {
    const dialogRef = this.dialog.open(ItemsFormularioComponent, {
      width: '80%',
      data: {
        nuevo: false,
        bien: this.datos.bien,
        item: x
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result) {
        this.ngOnInit();
      }
    });
  }
  transferir(x) {
    const dialogRef = this.dialog.open(TransferirComponent, {
      width: '80%',
      height: '90%',
      data: {
        bien: this.datos.bien,
        item: x
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result) {
        this.ngOnInit();
      }
    });
  }

  async baja(x) {
    const w = {
      fecha: this.datePipe.transform(this.fecha, 'yyyy-MM-dd'),
      bienA: this.datos.bien._id,
      item: x._id,
      observaciones: 'Dar de baja',
      transferencia: false,
      baja: true,
      usuario: this.cookieService.get('cokidemiproyecto')
    };

    var opcion = confirm("Esta seguro?");
    if (opcion == true) {
      this.gServicio.bajarItem(w).subscribe((data) => {

        alert('Se dio de baja el item');
        this.ngOnInit();
      });
    } else {

    }
    
  }

  crearItem() {
    const dialogRef = this.dialog.open(ItemsFormularioComponent, {
      width: '80%',
      data: {
        nuevo: true,
        bien: this.datos.bien
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result) {
        this.ngOnInit();
      }
    });
  }
  // CERRAR VENTANA
  onNoClick(): void {
    this.dialogRef.close(false);
  }

}
