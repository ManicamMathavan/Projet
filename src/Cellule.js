import Etat from "./Divers/Etat";
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


    retirerBateau(){
      this.interdit--;
      this.bateau = null;
    }
     
}

export default Cellule;