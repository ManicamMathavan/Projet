import Coord from './Coord.js';
import Direction from './Direction.js';
class Bateau{
    #case_fin;
    #case_debut;
    #case_interdite_debut;
    #case_interdite_fin;
    constructor(nom,taille,direction,case_x,case_y,grille){
        this.direction=direction;
        this.nom = nom;
        this.taille = taille;
        this.case_debut= new Coord(case_x,case_y);
        this.grille = grille;
    }

    get case_interdite_debut(){
        return this.#case_interdite_debut;
    }
    get case_interdite_fin(){
        return this.#case_interdite_fin;
    }

    get case_debut(){
        return this.#case_debut;
    }

    set case_debut(value){
        this.#case_debut = value;
        this.#case_interdite_debut = new Coord(this.case_debut.x-1,this.case_debut.y-1);
        if(this.direction == Direction.HORIZONTAL){
            this.#case_fin = new Coord(this.case_debut.x+this.taille-1,this.case_debut.y);
            this.#case_interdite_fin = new Coord(this.case_fin.x+1,this.case_fin.y+1);

        }
        else{
            this.#case_fin = new Coord(this.case_debut.x,this.case_debut.y+this.taille-1);
            this.#case_interdite_fin = new Coord(this.case_fin.x+1,this.case_fin.y+1);
        }
    }


    get case_fin(){
        return this.#case_fin;
    }

    coordValide(coord) {
        return (
          coord.x >= this.#case_debut.x &&
          coord.x <= this.#case_fin.x &&
          coord.y >= this.#case_debut.y &&
          coord.y <= this.#case_fin.y
        );
      }

}
export default Bateau;