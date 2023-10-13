import { Component, OnInit } from '@angular/core';
import { PrincipalService } from '../servicio/principal.service'
import {Router, NavigationStart, NavigationEnd} from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

declare var $:any

declare var swal:any
declare var Swal:any
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  ver:boolean=true
  usu:any={}
  constructor(private router:Router,private cookieService: CookieService, public api:PrincipalService) { }

  texto(){
    this.ver=!this.ver
  }
  ngOnInit() {
  	var x = this.cookieService.get('cokidemiproyecto');
    if(x!="") {
        
        this.router.navigate(['home']);
      
    }else{
        this.router.navigate(['login']);
    }
  	 /**
	  * Make Login
	  */
	 

  }
  entrar(){
    
    
    this.api.loguin(this.usu).subscribe((datos)=>{
      if(datos.json().mensaje=="no ay") {
        alert('Siga intentando ')
        
        
      }else{
        
        this.cookieService.set( 'cokidemiproyecto', String(datos.json()._id) );
        //this.cookieService.set( 'sucursal', this.sucursal );
        
        this.router.navigate(['home']);
        
      }
      
    })
  	 
  }

}
