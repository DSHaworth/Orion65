import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
//
import { HomeComponent } from './views/home/home.component';
import { AboutComponent } from './views/about/about.component';
import { TestComponent } from './views/test/test.component';

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'about', component: AboutComponent},
  {path: 'test', component: TestComponent},
  { 
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  { path: '**', redirectTo: '/home' }    
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
