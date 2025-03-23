import Etat from "./Divers/Etat";

/**
 * @property {Bateau} bateau - Bateau présent sur la case, ou null si aucun bateau.
 * @property {Etat} etat - État de la case.
 * @property {number} interdit - État d'une zone interdite sur la case.
 */
class Cellule {
    bateau;
    etat;
    interdit;
  constructor() {
    //état d'une case
    this.etat = Etat.VIDE;
    //état d'une zone interdite sur la case
    this.interdit=0;
    //bateau présent sur la case, ou null si aucun bateau
    this.bateau=null
  }


  /**
   * Retire le bateau de la case et diminue le compteur de zones interdites (celle-ci appartiennent au bateau).
   */
    retirerBateau(){
      this.interdit--;
      this.bateau = null;
    }
     
}

export default Cellule;