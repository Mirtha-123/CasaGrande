import { Component } from '@angular/core';
import {Router} from '@angular/router';
declare var $:any
import { MensajeService } from './mensaje/mensaje.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'casagrande';
 
  message;
 		
  constructor(private router:Router,private messagingService: MensajeService) { }
  ngOnInit() {
  //this.messagingService.requestPermission()
  this.messagingService.receiveMessage()
  this.message = this.messagingService.currentMessage
      this.router.navigate(['login']);
      
    
  }
}
	