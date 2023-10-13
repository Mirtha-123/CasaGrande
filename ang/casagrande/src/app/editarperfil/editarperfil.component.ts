import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { PrincipalService } from '../servicio/principal.service'
declare var swal:any
@Component({
  selector: 'app-editarperfil',
  templateUrl: './editarperfil.component.html',
  styleUrls: ['./editarperfil.component.css']
})
export class EditarperfilComponent implements OnInit {
	actu:any={}

  constructor(private cookieService: CookieService, public api:PrincipalService) { }

  ngOnInit() {
  	var x = this.cookieService.get('cokidemiproyecto');
  	console.log(x)
  	var y={
  		usuario:x
  	}
  	this.api.buscarusuarioparaeditar(y).subscribe((data)=>{
  		this.actu=data.json()
  	})
  }
  actualizaciondeusuarios(){
  	this.api.actualizarusuarios(this.actu).subscribe((data)=>{
  		 alert("Se actualizo correctamente!");
  	})
  }

}
