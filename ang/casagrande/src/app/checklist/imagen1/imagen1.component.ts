import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';

import { CookieService } from 'ngx-cookie-service';
import { PrincipalService } from 'src/app/servicio/principal.service';
import { saveAs } from 'file-saver';
import { I18nInterface, ImageDrawingComponent } from 'ngx-image-drawing';

// SUBIR
import { FileUploader } from 'ng2-file-upload';
import { DatePipe } from '@angular/common';
const URL = 'https://casagrande-erp.com/api/upload';

declare var swal: any
@Component({
  selector: 'app-imagen1',
  templateUrl: './imagen1.component.html',
  styleUrls: ['./imagen1.component.css'],
  providers: [DatePipe]
})
export class Imagen1Component implements OnInit {

  loading: any
  fotito: any;
  lasfotos: any = [];
  public uploader: FileUploader = new FileUploader({ url: URL, itemAlias: 'photo' });



  public i18n: I18nInterface = {
    saveBtn: 'Save the image as JPEG !',
    sizes: {
      extra: 'Extra'
    }
  };
  url: any = './assets/combustible.png';
  constructor(
    public api: PrincipalService,
    public dialog: MatDialog,
    private router: Router,
    public dialogRef: MatDialogRef<Imagen1Component>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public gServicio: PrincipalService,
    private datePipe: DatePipe,
    private cookieService: CookieService
  ) { }

  ngOnInit() {

    console.log(this.uploader);
    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      console.log('ImageUpload:uploaded:', item, status, response);
      console.log(response);

      var x = JSON.parse(response);
      this.fotito = x.success.secure_url;
      console.log(x)
      var p = {
        fotito: this.fotito,
      }


      alert("Gracias se cargo correctamente!");
      this.dialogRef.close(x) ;


    };
  }
  public saveBtn($event) {
    console.log($event);
    saveAs($event, 'image.jpg');

  }
  // INICIAR, DESPUES

  save(x) {
    console.log(x);
    let files1: Array<File> = [];
    var files = new File([x], "name");
    files1.push(files);
    this.uploader.addToQueue(files1);
    console.log(this.uploader);
    this.uploader.uploadAll();
 
    /*var myBlob = new Blob(x);

    //do stuff here to give the blob some data...

    var myFile = this.blobToFile(x, "my-image.png");
    console.log(myFile);*/
  }
  cancel() {

  }
  blobToFile(theBlob, fileName) {
    // A Blob() is almost a File() - it's just missing the two properties below which we will add
    theBlob.lastModifiedDate = new Date();
    theBlob.name = fileName;
    return theBlob;
  }
  // CERRAR VENTANA
  onNoClick(): void {
    this.dialogRef.close(false);
  }
}
