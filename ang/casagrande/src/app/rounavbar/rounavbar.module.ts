import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RounavbarRoutingModule } from './rounavbar-routing.module';
import { NavbarComponent } from '../navbar/navbar.component';

import { NgxPrintModule } from 'ngx-print';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';

import {
  MatInputModule, MatMenuModule,MatProgressSpinnerModule,MatSliderModule, MatBadgeModule, MatButtonModule, MatDividerModule, MatTabsModule, MatCheckboxModule, MatPaginatorModule, MatTableModule,
  MatSortModule, MatRadioModule, MatProgressBarModule, MatTooltipModule, MatPaginatorIntl, MatNativeDateModule, MatToolbarModule, MatCardModule, MatIconModule, MatSidenavModule, MatSelectModule, MatOptionModule
} from '@angular/material';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FileSelectDirective, FileUploadModule } from 'ng2-file-upload';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
@NgModule({
  exports: [NavbarComponent, FileUploadModule,
    FileUploadModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatInputModule,
    MatToolbarModule,
    MatCardModule,
    MatIconModule,
    MatTabsModule,
    MatSidenavModule,
    MatRadioModule,
    MatSliderModule,
    MatMenuModule,
    MatDividerModule,
    MatButtonModule,
    MatBadgeModule,
    MatDialogModule,
    MatCheckboxModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    MatProgressBarModule,
    MatNativeDateModule,
    MatTooltipModule,
    NgxPrintModule,
    AngularMultiSelectModule,
    MDBBootstrapModule

  ],
  declarations: [
    NavbarComponent
  ],
  imports: [
    FileUploadModule,
    NgxPrintModule,
    AngularMultiSelectModule,
    FileUploadModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MDBBootstrapModule.forRoot(),
    MatSortModule,
    MatInputModule,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatSidenavModule,
    MatBadgeModule,
    MatRadioModule,
    MatDialogModule,
    MatCheckboxModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    MatProgressBarModule,
    MatNativeDateModule,
    MatTooltipModule,
    CommonModule,
    RounavbarRoutingModule
  ]
})
export class RounavbarModule { }
