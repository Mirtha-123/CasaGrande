import { Component, OnInit } from '@angular/core';
import { NgWhiteboardService } from 'ng-whiteboard';

declare var $: any;
declare var html2canvas: any;
@Component({
  selector: 'app-formulario-c',
  templateUrl: './formulario-c.component.html',
  styleUrls: ['./formulario-c.component.css'],
  providers: [NgWhiteboardService]
})
export class FormularioCComponent implements OnInit {
  mas: any = {
    motivo: '',
  }
  constructor() { }

  ngOnInit() {
  }
  guardarcheck() {
    html2canvas($("#screen"), {
      onrendered: function (canvas) {
        // canvas is the final rendered <canvas> element
        var a = document.createElement('a');
        // toDataURL defaults to png, so we need to request a jpeg, then convert for file download.
        a.href = canvas.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream");
        a.download = 'somefilename.jpg';
        a.click();
        /* var myImage = canvas.toDataURL("image/png");
 
         console.log(myImage);
         window.open(myImage);*/

      }
    });
  }

}
