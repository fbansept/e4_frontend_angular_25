import {Component, inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {RouterLink} from '@angular/router';
import {NotificationService} from '../../services/notification.service';

@Component({
  selector: 'app-accueil',
  imports: [MatButtonModule, MatCardModule, RouterLink],
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.scss'
})
export class AccueilComponent {

  http = inject(HttpClient)
  produits: Produit[] = []
  notification = inject(NotificationService)

  ngOnInit(){
    this.recupererProduits()
  }

  recupererProduits() {
    this.http
      .get<Produit[]>("http://localhost:8080/produits")
      .subscribe(produits => this.produits = produits)
  }

  onSupprimerProduit(produit: Produit) {
    this.http
      .patch("http://localhost:8080/produit/rendre-indisponible/" + produit.id, null)
      .subscribe({
        next : resultat => {
          this.notification.show("Le produit a bien été supprimé")
          this.recupererProduits()
        },
        error : erreur => {
          if(erreur.status == 304) {
            this.notification.show("Le produit était déjà marqué indisponible", "warning")
          }
          this.recupererProduits()
        }
      })
  }

}
