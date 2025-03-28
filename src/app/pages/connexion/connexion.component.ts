import {Component, inject} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatError, MatFormField, MatInput, MatInputModule, MatLabel} from "@angular/material/input";
import {Router, RouterLink} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {HttpClient} from '@angular/common/http';
import {NotificationService} from '../../services/notification.service';

@Component({
  selector: 'app-connexion',
  imports: [
    FormsModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule
  ],
  templateUrl: './connexion.component.html',
  styleUrl: './connexion.component.scss'
})
export class ConnexionComponent {

  formBuilder = inject(FormBuilder)
  http = inject(HttpClient)
  notification = inject(NotificationService);
  router = inject(Router);

  formulaire = this.formBuilder.group({
    "email" : ["",[Validators.required,Validators.email]],
    "password" : ["",[Validators.required]],
  })

  onConnexion() {

    if(this.formulaire.valid) {

      this.http.post(
        "http://localhost:8080/connexion",
        this.formulaire.value,
        {responseType: "text"}
      ).subscribe({
        next : jwt => {
          localStorage.setItem("jwt", jwt);
          this.notification.show("Vous etes connecté");
          this.router.navigateByUrl("/accueil")
        },
        error : erreur => {
          if(erreur.status == 401) {
            this.notification.show("Mauvais login / mot de passe", "error");
          }
        }
      })
    }

  }

}
