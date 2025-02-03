

import Etat from "./Etat.js";

class Grille {
  constructor(largeur, hauteur) {
    this.largeur = largeur;
    this.hauteur = hauteur;
    this.grille= []
    for(let i = 0; i < largeur; i++) {
        this.grille.push([]);
      for(let j = 0; j < hauteur; j++) {
        this.grille[i].push(Etat.VIDE); 
      }
    }
  }

//   getCase(x, y) {
//     return this.cases[y * this.largeur + x];
//   }

//   setCase(x, y, valeur)
}

const grille = new Grille(10, 10);

console.log(grille)