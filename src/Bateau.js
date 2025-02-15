import Coord from "./Enum/Coord.js";
import Direction from "./Enum/Direction.js";

/**
 * Classe representant un bateau
 * @property {Coord} case_fin - coordonne de la case de fin du bateau
 * @property {Coord} case_debut - coordonne de la case de debut du bateau
 * @property {Coord} case_interdite_debut - coordonne de la zone interdite de debut du bateau 
 * (correspond à l'écart de 1 case entre chaque bateau)
 * @property {Coord} case_interdite_fin - coordonne de la zone interdite de fin du bateau
 * (correspond à l'écart de 1 case entre chaque bateau)
 */
class Bateau {
  #coord_fin;
  #coord_debut;
  #coord_interdite_debut;
  #coord_interdite_fin;
  //permet de savoir les case du bateau qui ont été toucher par un tir
  cases_est_touche;
  /**
   * Constructeur d'un bateau
   * @param {string} nom - nom du bateau
   * @param {number} taille - taille du bateau
   * @param {Direction} direction - direction du bateau
   * @param {number} case_x - coordonne x de la case de depart du bateau
   * @param {number} case_y - coordonne y de la case de depart du bateau
   */
  constructor(nom, taille, direction, case_x, case_y) {
    this.direction = direction;
    this.nom = nom;
    this.taille = taille;

    //inititialise aussi les autre attribut via le setter de case_debut
    this.coord_debut = new Coord(case_x, case_y);

    const hauteur_cases=this.#coord_fin.y-this.#coord_debut.y+1
    const largeur_cases=this.#coord_fin.x-this.#coord_debut.x+1

    //etat des cases (detruit ou non)
    this.cases_est_touche = Array.from(
          { length: hauteur_cases },
          () => Array.from({length: largeur_cases},()=>false)
        )
        
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
   * @param {Coord} value - nouvelle coordonne de la case de debut du bateau
   */
  set coord_debut(value) {
    console.log("dedans")
    //changer case_debut
    this.#coord_debut = value;

    //changer case_interdite_debut
    this.#coord_interdite_debut = new Coord(
      this.coord_debut.x - 1,
      this.coord_debut.y - 1
    );

    //changer case_interdite_fin et case_fin en fonction de la direction
    if (this.direction == Direction.HORIZONTAL) {
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

  //verifie si une coordonnée est contenu dans le bateau
  estContenu(coord) {
    return (
      coord.x >= this.#coord_debut.x &&
      coord.x <= this.#coord_fin.x &&
      coord.y >= this.#coord_debut.y &&
      coord.y <= this.#coord_fin.y
    );
  }



  estDetruit(){
    //verifier si toute les cases sont detruite
    return !this.cases_est_touche.some((ligne)=>ligne.includes(false))
  }





  
}
export default Bateau;
