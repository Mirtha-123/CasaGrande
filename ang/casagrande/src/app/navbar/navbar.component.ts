import { Component, OnInit } from '@angular/core';
import { PrincipalService } from '../servicio/principal.service'
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private router: Router, private cookieService: CookieService, public api: PrincipalService) { }
  nombres: any = {}
  tiempo: any
  notificacion: any = [];
  aqui() {
    this.api.bienes1().subscribe((data) => {
      console.log(data);
    });
  }
  ngOnInit() {
    this.nombre();
    this.startTime();
    this.obtener();
  }
  obtener() {
    this.api.NotificacionesListaPersonal(this.cookieService.get('cokidemiproyecto')).subscribe((data) => {
      this.notificacion = data.json();
    });
  }
  home() {
    clearTimeout(this.tiempo);
    this.router.navigate(['home']);
  }
  nombre() {
    var x = {
      nombre: this.cookieService.get('cokidemiproyecto')
    }
    this.api.verminombre(x).subscribe((data) => {
      this.nombres = data.json()
    })
  }
  cerrar() {
    clearTimeout(this.tiempo)
    var x = {
      nombre: this.cookieService.get('cokidemiproyecto')
    }
    this.api.serrar(x).subscribe((datos) => {
      console.log(datos)
      this.cookieService.deleteAll();

      this.router.navigate(['login']);
    })
  }
  perfil() {
    this.router.navigate(['perfil']);
  }
  notificaciones() {
    this.router.navigate(['notificaciones']);
  }
  startTime() {
    var today = new Date();
    var hr = today.getHours();
    var min = today.getMinutes();
    var sec = today.getSeconds();
    var ap
    ap = (hr < 12) ? "<span>AM</span>" : "<span>PM</span>";
    hr = (hr == 0) ? 12 : hr;
    hr = (hr > 12) ? hr - 12 : hr;
    //Add a zero in front of numbers<10
    hr = this.checkTime(hr);
    min = this.checkTime(min);
    sec = this.checkTime(sec);


    var months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    var days = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'domingo'];

    var curWeekDay = days[today.getDay() - 1];
    var curDay = today.getDate();
    var curMonth = months[today.getMonth()];
    var curYear = today.getFullYear();
    var date = curWeekDay + ", " + curDay + " " + curMonth + " " + curYear;
    document.getElementById("reloj").innerHTML = curWeekDay + ", " + " " + curDay + " " + curMonth + " " + curYear + " " + hr + ":" + min + ":" + sec + " " + ap;

    this.tiempo = setTimeout(() => { this.startTime() }, 500);
  }
  checkTime(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  }

}
