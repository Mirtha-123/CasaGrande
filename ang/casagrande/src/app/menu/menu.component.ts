import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { PrincipalService } from '../servicio/principal.service'

declare var $: any
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  menus: any = []
  colores = ['#374be1', '#757575']
  constructor(private router: Router, private cookieService: CookieService, public api: PrincipalService) { }

  ngOnInit() {

    var x = {
      id: this.cookieService.get('cokidemiproyecto')
    }
    this.api.verpermisos(x).subscribe((data) => {
      console.log(data.json())
      this.menus = data.json()
    })

  }
  bien() {
    this.router.navigate(['bienes_casagrande']);
  }
  cargo() {
    this.router.navigate(['partes_diario']);
  }
  usuarios() {
    this.router.navigate(['usuarios']);
  }
  od() {
    this.router.navigate(['ordenes_servicio']);

  }
  solicitud() {
    this.router.navigate(['sol_com']);
  }
  proyectos() {
    this.router.navigate(['proy_cg']);
  }
  preventivos() {
    this.router.navigate(['preventivo_cg']);
  }
}
