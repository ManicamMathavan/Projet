import Coord from "./Divers/Coord.js";
import Direction from "./Divers/Direction.js";

class Bateau {
  #coord_fin;
  #coord_debut;
  #coord_interdite_debut;
  #coord_interdite_fin;
  #direction;
  cases_est_touche;
  /**
   * Constructeur d'un bateau
   * @param {string} nom - nom du bateau
   * @param {number} taille - taille du bateau
   * @param {Direction} direction - direction du bateau
   * @param {number} case_x - coordonne x de la case de depart du bateau
   * @param {number} case_y - coordonne y de la case de depart du bateau
   * @param {Array} cases_est_touche - tableau de boolean representant l'etat des cases du bateau
   */
  constructor(nom, taille, direction, case_x, case_y) {
    this.#direction = direction;
    this.nom = nom;
    this.taille = taille;
    this.#coord_debut = new Coord(case_x, case_y);
    this.change_coord(this.#coord_debut);
    //etat des cases (detruit ou non)
    this.cases_est_touche = Array.from(
          { length: taille },
          () => false
        );
        
  }
  get direction() {
    return this.#direction;
  }
   
  /**
   * Change la direction du bateau et change ses coordonnes si sa direction est changé.
   * @param {Direction} direction - La nouvelle direction du bateau.
   */
  changer_direction(direction){
    if (direction==this.#direction){
      return;
    }
  this.#direction = direction
  this.change_coord(this.#coord_debut)
}

  get coord_interdite_debut() {
    return this.#coord_interdite_debut;
  }
  get coord_interdite_fin() {
    return this.#coord_interdite_fin;
  }

  get coord_debut() {
    return this.#coord_debut;
  }

  /**
   * Modifie la coordonne de la case de debut du bateau
   * met a jour automatiquement les coordonnees de la case de fin du bateau,
   * ainsi que les coordonnees des zones interdites entourant le bateau
   * @param {Coord} coord_debut - nouvelle coordonne de la case de debut du bateau
   */
   change_coord(coord_debut) {
    //changer case_debut
    this.#coord_debut = coord_debut;

    //changer case_interdite_debut
    this.#coord_interdite_debut = new Coord(
      this.coord_debut.x - 1,
      this.coord_debut.y - 1
    );

    //changer case_interdite_fin et case_fin en fonction de la direction
    if (this.#direction == Direction.HORIZONTAL) {
      this.#coord_fin = new Coord(
        this.coord_debut.x + this.taille - 1,
        this.coord_debut.y
      );
      this.#coord_interdite_fin = new Coord(
        this.coord_fin.x + 1,
        this.coord_fin.y + 1
      );
    } else {
      this.#coord_fin = new Coord(
        this.coord_debut.x,
        this.coord_debut.y + this.taille - 1
      );
      this.#coord_interdite_fin = new Coord(
        this.coord_fin.x + 1,
        this.coord_fin.y + 1
      );
    }
  }

  get coord_fin() {
    return this.#coord_fin;
  }


  /**
   * Vérifie si une coordonne est contenue dans le bateau
   * @param {Coord} coord - coordonne vérifier
   * @returns {boolean} - true si la coordonne  est contenue dans le bateau, false sinon
   */
  estContenu(coord) {
    return (
      coord.x >= this.#coord_debut.x &&
      coord.x <= this.#coord_fin.x &&
      coord.y >= this.#coord_debut.y &&
      coord.y <= this.#coord_fin.y
    );
  }

  /**
   * Verifie si une coordonnée est dans une zone interdite.
   * @param {Coord} coord - La coordonnée a vérifier.
   * @returns {boolean} - Vrai si la coordonnée est dans une zone interdite.
   */
  estContenuInterdit(coord) {
    return (
      coord.x >= this.#coord_interdite_debut.x &&
      coord.x <= this.#coord_interdite_fin.x &&
      coord.y >= this.#coord_interdite_debut.y &&
      coord.y <= this.#coord_interdite_fin.y
    );
  }



  /**
   * Verifie si le bateau est detruit.
   * @returns {boolean} - Vrai si le bateau est detruit.
   */
  estDetruit(){
    //verifier si toute les cases sont detruite
    return !this.cases_est_touche.includes(false);
  }

  toJSON() {
    return {
      nom: this.nom,
      taille: this.taille,
      direction: this.#direction,
      coord_debut: this.#coord_debut,
      coord_interdite_debut: this.#coord_interdite_debut,
      coord_interdite_fin: this.#coord_interdite_fin,
      coord_fin: this.#coord_fin
    }
  }





  
}
export default Bateau;
