import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReportTableComponent } from './report-table/report-table.component';
import { ReportDetailComponent } from './report-detail/report-detail.component';


import { ReportFormComponent } from './report-form/report-form.component';
import { ReportEditComponent } from './report-edit/report-edit.component';


import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MapComponent } from './map/map.component';
import { HttpClientModule } from '@angular/common/http';




@NgModule({
  declarations: [
    AppComponent,
    ReportTableComponent,
    ReportDetailComponent,
    ReportFormComponent,
    ReportEditComponent,
    MapComponent,

  ],

  imports: [
    BrowserModule,
    AppRoutingModule,
    MatTableModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
