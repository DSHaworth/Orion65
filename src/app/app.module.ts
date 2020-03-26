import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from "@angular/flex-layout";
import { HttpClientModule } from '@angular/common/http';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { AboutComponent } from './views/about/about.component';
import { HomeComponent } from './views/home/home.component';
import { TestComponent } from './views/test/test.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { LandingPageComponent } from './views/landing-page/landing-page.component';
import { SnackbarComponent } from './services/ui/snackbar.service';
import { interceptorProviders } from './services/interceptors/interceptors';
import { SafePipe } from './pipes/safe.pipe';

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    HomeComponent,
    TestComponent,
    NavbarComponent,    
    LandingPageComponent,
    SideNavComponent,
    SnackbarComponent,
    SafePipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    HttpClientModule,
    MatNativeDateModule,

    MaterialModule
  ],
  entryComponents: [SnackbarComponent],
  providers: [ interceptorProviders ],
  bootstrap: [AppComponent]
})
export class AppModule { }
