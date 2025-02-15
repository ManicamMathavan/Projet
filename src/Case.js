import Etat from "./Enum/Etat";
class Case {
    #bateau;
    #etat;
    #interdit;
  constructor() {
    //état d'une case
    this.#etat = Etat.VIDE;
    //état d'une zone interdite sur la case
    this.#interdit=0;
    //bateau présent sur la case, ou null si aucun bateau
    this.#bateau=null
  }




    set bateau(value){
      this.#bateau = value;
    }
    get bateau(){
      return this.#bateau
    }

   set etat (value){
    this.#etat = value;
  }
    get etat(){
      return this.#etat;
    }
    set interdit(value){  
      this.#interdit = value;
    }
    get interdit(){
      return this.#interdit;
    }

    retirerBateau(){
      this.#interdit--;
      this.bateau = null;
    }
     
    /**
     * Ajoute les coordonnes d'un objet Coord a la coordonne actuelle
     * @param {Coord} coord - objet Coord a ajouter
     */
    addCoord(coord){
      this.x+=coord.x;
      this.y+=coord.y;
    }

}

export default Case;