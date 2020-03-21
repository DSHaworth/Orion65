import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { AboutComponent } from './views/about/about.component';
import { HomeComponent } from './views/home/home.component';
import { TestComponent } from './views/test/test.component';

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    HomeComponent,
    TestComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,

    MaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
