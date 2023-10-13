import { Component, OnInit,ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {Router} from '@angular/router';
import { PrincipalService } from '../servicio/principal.service'
import {FormControl} from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { Chart } from 'chart.js';


declare var $:any
declare var swal:any
@Component({
  selector: 'app-proyectos',
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.css']
})
export class ProyectosComponent implements OnInit {
	numero:any
	proyecto:any={}

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  displayedColumns: string[] = ['_id','codigo', 'nombre', 'descripcion','acciones'];
  latabla:any=[]
  ayuda:any
  constructor(public api:PrincipalService,private router:Router,private cookieService: CookieService) { }
  finalizado(){
    
  }
  applyFilter(filterValue: string) {
      this.latabla.filter = filterValue.trim().toLowerCase();

      if (this.latabla.paginator) {
        this.latabla.paginator.firstPage();
      }
    }
  ngOnInit() {

    this.api.misproyectos().subscribe((data)=>{
        this.ayuda=data.json()
      console.log(data.json())
       this.latabla = new MatTableDataSource(this.ayuda);
       this.latabla.paginator = this.paginator;
      this.latabla.sort = this.sort;
      
    })
  	this.numerodeproyecto()
  	var forms = document.getElementsByClassName('needs-validation');
    // Loop over them and prevent submission
    var validation = Array.prototype.filter.call(forms, function(form) {
      form.addEventListener('submit', function(event) {
        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add('was-validated');
      }, false);
    });
  }
  enviar1(){
  	this.proyecto.codigo=this.numero
    this.proyecto.estado="Habilitado"
  	this.api.nuevoproyecto(this.proyecto).subscribe((data)=>{
  		 alert("Gracias se cargo correctamente!");
  		  $('#test-modal-7').modal('hide');
  		this.proyecto={}
  		this.numerodeproyecto()
  	})
  	  }
  numerodeproyecto(){
  	this.api.codigoproyecto().subscribe((data)=>{
  		this.numero=data.json().mensaje

  	})
  }
  editarp(x){
    this.proyecto=x
   
  }
  actualizadop(){
    var opcion = confirm("Esta seguro? Editara los datos");
    if (opcion == true) {
      this.api.editarunproyecto(this.proyecto).subscribe((data)=>{
        $("#test-modal-76").modal('hide')
               alert("El Documento se actualizo");
             })
    } else {

    }
    
    console.log(this.proyecto)
  }
  limpiar(){
    this.proyecto={}
  }

  eliminarp(x){
    
    swal({
        title: "Esta Seguro?",
        text: "Eliminar el Proyecto!",
        icon: "info",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
         
          
        } 
      });
  }
}
