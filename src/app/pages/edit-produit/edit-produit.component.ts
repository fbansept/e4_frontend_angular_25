import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {NotificationService} from '../../services/notification.service';
import {MatSelectModule} from '@angular/material/select';

@Component({
  selector: 'app-edit-produit',
  imports: [
    FormsModule,
    MatInputModule,
    MatButtonModule,
    RouterLink,
    ReactiveFormsModule,
    MatSelectModule
  ],
  templateUrl: './edit-produit.component.html',
  styleUrl: './edit-produit.component.scss'
})
export class EditProduitComponent implements OnInit{

  formBuilder = inject(FormBuilder)
  http = inject(HttpClient)
  notification = inject(NotificationService);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  produitEditer: Produit | null = null;

  etats: Etat[] = []
  etiquettes: Etiquette[] = []

  ngOnInit(): void {

    this.http.get<Etat[]>("http://localhost:8080/etats")
      .subscribe(etats => this.etats = etats)

    this.http.get<Etiquette[]>("http://localhost:8080/etiquettes")
      .subscribe(etiquettes => this.etiquettes = etiquettes)

    this.activatedRoute.params.subscribe(
      parametres => {
        if(parametres['id']){
          this.http
            .get<Produit>("http://localhost:8080/produit/" + parametres['id'])
            .subscribe({
              next : produit => {
                this.formulaire.patchValue(produit);
                this.produitEditer = produit;
              },
              error : erreur => {
                if(erreur.status == 404) {
                  this.notification.show("Ce produit n'existe pas", 'error')
                  this.router.navigateByUrl("/accueil")
                }
              }
            })
        }
      }
    )

  }

  formulaire = this.formBuilder.group({
    "nom" : ["Nouveau produit",[Validators.required]],
    "code" : ["UnCode",[Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    "prix" : [10,[Validators.required, Validators.min(0)]],
    "description" : ["",[]],
    "etat": [{id:1}, []],
    "etiquettes": [[] as Etiquette[]]
  })

  onAjoutProduit() {

    if(this.formulaire.valid) {

      if(this.produitEditer) {

        this.http
          .put("http://localhost:8080/produit/" + this.produitEditer.id, this.formulaire.value)
          .subscribe(
            {
              next : produit => {
                this.notification.show("Le produit a bien été modifié")
                this.router.navigateByUrl("/accueil")
              },
              error : erreur => {
                if(erreur.status == 409) {
                  this.notification.show("Ce code est déjà utilisé par un autre produit", "error")
                }
              }
            })

      } else {

        this.http
          .post("http://localhost:8080/produit", this.formulaire.value)
          .subscribe(
            {
              next : produit => {
                this.notification.show("Le produit a bien été ajouté")
                this.router.navigateByUrl("/accueil")
              },
              error : erreur => {
                if(erreur.status == 409) {
                  this.notification.show("Ce code est déjà utilisé par un autre produit", "error")
                }
              }
            }
          )
      }
    }
  }

  compareWithId(o1: { id:number }, o2: { id:number }) {
    return o1.id == o2.id
  }

}
