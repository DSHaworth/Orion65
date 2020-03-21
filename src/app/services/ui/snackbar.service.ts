import { Component, Injectable, Inject } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private snackbar: MatSnackBar) { }

  defaultDisplayTime:number = 5;

  showError(message: string){
    this.snackbar.openFromComponent(SnackbarComponent, {
      data: {message: message, icon: "fa-exclamation-circle"},
      duration: this.defaultDisplayTime * 1000,
      horizontalPosition: "center",
      verticalPosition: "top",
      panelClass: ["customize-snackbar", "snackbar-error"]
    });
  }

  showSuccess(message: string){
    this.snackbar.openFromComponent(SnackbarComponent, {
      data: {message: message, icon: "fa-check-circle"},
      duration: this.defaultDisplayTime * 1000,
      horizontalPosition: "center",
      verticalPosition: "top",
      panelClass: ["customize-snackbar", "snackbar-success"]
    });
  }

  showInfo(message: string){
    this.snackbar.openFromComponent(SnackbarComponent, {
      data: {message: message, icon: "fa-info-circle"},
      duration: this.defaultDisplayTime * 1000,
      horizontalPosition: "center",
      verticalPosition: "top",
      panelClass: ["customize-snackbar", "snackbar-error"]
    });
  }  
}

import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
@Component({
  selector: 'snack-bar-component-example-snack',
  template: `
<div class="flex v-center">
  <div class="flex v-center">
    <div class="message-icon">  
      <i class="fas {{data.icon}}"></i>
    </div>
    <div class="data">{{data.message}}</div>
  </div>  
  <div class="dismiss">
    <button mat-icon-button (click)="snackBarRef.dismiss()">
      <mat-icon>close</mat-icon>
    </button>
  </div>
</div>`
})
export class SnackbarComponent {
  constructor(
    public snackBarRef: MatSnackBarRef<SnackbarComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: any
  ) { }
}