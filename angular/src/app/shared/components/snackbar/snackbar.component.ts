import { Component, Inject  } from '@angular/core';
import {  MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { AngularMaterialComponents } from '../../angular-material.component';

@Component({
  selector: 'app-snackbar',
  imports: [ AngularMaterialComponents ],
  templateUrl: './snackbar.component.html',
  styleUrl: './snackbar.component.css'
})
export class SnackbarComponent {

  constructor(
    public snackBarRef: MatSnackBarRef<SnackbarComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: { message: string }
  ) { }

  close() {
    this.snackBarRef.dismissWithAction();
  }

}
