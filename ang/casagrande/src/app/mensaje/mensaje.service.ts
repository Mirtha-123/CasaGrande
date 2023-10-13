import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { BehaviorSubject } from 'rxjs'
import { Http, Response } from '@angular/http';
import { HttpClient } from '@angular/common/http'
import { CookieService } from 'ngx-cookie-service';
import { mergeMapTo } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class MensajeService {
	dominio: string = 'https://casagrande-erp.com/';
currentMessage = new BehaviorSubject(null);
  constructor(private angularFireMessaging: AngularFireMessaging,private http: Http , private https:HttpClient	,private cookieService: CookieService) {
  this.angularFireMessaging.messaging.subscribe(
(_messaging) => {
_messaging.onMessage = _messaging.onMessage.bind(_messaging);
_messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
}
)

 }
 crear(x){
  	return this.http.post(`${this.dominio}token/crear`,x)
  }
 requestPermission() {


 	this.angularFireMessaging.requestPermission
      .pipe(mergeMapTo(this.angularFireMessaging.tokenChanges))
      .subscribe(
        (token) => { var x = {
		usu:this.cookieService.get('cokidemiproyecto'),
		tok:token
	}
	this.crear(x).subscribe((data)=>{
		console.log(data.json())
	}) 
	console.log('Permission granted! Save to the server!', token); },
        (error) => { console.error(error); },  
      );
/*this.angularFireMessaging.requestToken.subscribe(
(token) => {
console.log(token);
	var x = {
		usu:this.cookieService.get('cokidemiproyecto'),
		tok:token
	}
	this.crear(x).subscribe((data)=>{
		console.log(data.json())
	})

},
(err) => {
console.error('Unable to get permission to notify.', err);
}
);*/
}
receiveMessage() {
this.angularFireMessaging.messages.subscribe(
(payload) => {
console.log("new message received. ", payload);
this.currentMessage.next(payload);
})
}
}
