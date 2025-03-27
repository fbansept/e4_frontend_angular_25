import {inject, Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  snackBar = inject(MatSnackBar);

  constructor() { }

  show(message: string, type : "valid" | "error" | "warning" = "valid") {
    this.snackBar.open(message, "",
      {verticalPosition: 'top',duration: 5000, panelClass: type})
  }

}
