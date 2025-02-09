

import Etat from "./Etat.js";

class Grille {
    #largeur;
    #hauteur;
  constructor(largeur, hauteur) {
    this.#largeur = largeur;
    this.#hauteur = hauteur;
    this.grille= []
    for(let i = 0; i < largeur; i++) {
        this.grille.push([]);
      for(let j = 0; j < hauteur; j++) {
        this.grille[i].push(Etat.VIDE); 
      }
    }
  }
get largeur() {
    return this.#largeur;
}

set largeur(value) {

    this.#largeur = Math.abs(value);
    grille = []
    for(let i = 0; i < largeur; i++) {
        this.grille.push([]);
      for(let j = 0; j < hauteur; j++) {
        this.grille[i].push(Etat.VIDE); 
      }
    }
}

get hauteur() {
    return this.#hauteur;
}

set hauteur(value) {
    this.#hauteur = Math.abs(value);
    grille = []
    for(let i = 0; i < largeur; i++) {
        this.grille.push([]);
      for(let j = 0; j < hauteur; j++) {
        this.grille[i].push(Etat.VIDE); 
      }
    }
}
}

const grille = new Grille(10, 10);

console.log(grille.largeur)