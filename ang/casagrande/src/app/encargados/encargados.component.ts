import {  Component, OnInit, ViewChild } from '@angular/core';
import { PrincipalService } from '../servicio/principal.service'
import { Subject } from 'rxjs';

declare var $:any
declare var swal:any
declare var XLSX:any
@Component({
  selector: 'app-encargados',
  templateUrl: './encargados.component.html',
  styleUrls: ['./encargados.component.css']
})
export class EncargadosComponent implements OnInit {

	@ViewChild('dataTable', {static: true}) table;
	  dataTable: any;
	  dtOptions: any;
	dtTrigger: Subject<any> = new Subject();


  latabla:any=[]
  bien:any={
  	nombre:"",
  	descripcion:"",
  	horometro:"",
  	hodometro:"",
  	estado:"",
  	ubicacion:""
  }
  importacion:any
  archivo: Array<File>
  constructor(public api:PrincipalService) { }

  ngOnInit() {
  	 var ayuda=[]
  	this.api.bienes().subscribe((data)=>{
      this.latabla=data.json()
      $('#tablita').DataTable( {
      	 buttons: [ 'copy', 'csv', 'excel' ],
      	responsive: true,
	    data: this.latabla,
	    columns: [
	        { data: 'codigo' },
	        { data: 'nombre' },
	        { data: 'descripcion' },
	        { data: 'horometro' },
	        { data: 'hodometro' },
	        { data: 'estado' },
	        { data: 'semaforizacion' },
	        { defaultContent: "<button class='btn btn-success'><i class='fas fa-check-circle'></i></button>"},
	        { defaultContent: "<button class='btn btn-primary'><i class='fas fa-check-circle'></i></button>"},
			{ defaultContent: "<button class='btn btn-danger' onclick='eliminar()'><i class='fas fa-check-circle'></i></button>"}
		
	    ]
		} );


  		console.log(data.json())
       
  	})
  }
  eliminar(){
  	console.log("presiono eliminar")
  }
  terminar(){
    this.bien.semaforizacion="libre"
    

    this.api.crear(this.bien).subscribe((data)=>{
      this.ngOnInit()
    })
  	console.log(this.bien)
  }
  actualizaciontabla(){
  	this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true
    };
    this.api.bienes().subscribe((data)=>{
      this.latabla=data.json()
      this.dtTrigger.next();
  	})

  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
  diferente(x){

  }
  enviar(){
    
  }

}
