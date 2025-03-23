import NomBateau from "./Divers/NomBateau"

class Joueur{
    #actions_restantes
    /**
     * Crée un joueur avec sa grille et la grille adverse.
     * @param {Grille} grille - grille du joueur
     * @param {Grille} grilleAdverse - grille adverse
     */
    constructor(grille,grilleAdverse){
        this.grille=grille
        this.grilleAdverse=grilleAdverse
        this.#actions_restantes
    }

    /**
     * Renvoie le nombre d'actions restantes pour ce joueur.
     * @returns {number} - le nombre d'action restantes
     */
    get actions_restantes(){
        return this.#actions_restantes
    }

    /**
     * Compte le nombre d'actions restantes du joueur en fonction de ses bateaux restants.
     */
    initActionsRestantes(){
        let nb_action=1
        let porte_avions_trouve=false
        this.grille.bateaux_restants.forEach((bateau)=>{
            console.log("bateau",bateau.nom)
            if(bateau.nom==NomBateau.PORTE_AVIONS){
                porte_avions_trouve=true
                nb_action+=1
                return
            }
            if(bateau.nom!=NomBateau.PATROUILLEUR){
                nb_action+=1
                return
            }
        })
        if(porte_avions_trouve){
            this.#actions_restantes=nb_action
        } else{
            this.#actions_restantes=1
        }

    }

    /**
     * Tirs sur une coordonnée de la grille adverse.
     * Réduit le nombre d'actions restantes si le tir ne detruit pas de bateaux.
     * @param {Coord} coord - La coordonnée cible du tir.
     */

    tirer(coord){ 
        if(!this.grilleAdverse.tirer(coord)){
            this.#actions_restantes-=1
        }
    }
    /**
     * Déplace un bateau dans la grille.
     * Réduit le nombre d'actions restantes.
     * @param {Bateau} bateau_initial - Bateau a déplacer.
     * @param {Sens | Coord} coord_to_add - Direction du déplacement par rapport a la position du bateau
     * .
     */
    deplacerBateau(bateau_initial, coord_to_add) {
    this.grille.deplacerBateau(bateau_initial, coord_to_add)
    this.#actions_restantes-=1
    }

    
    /**
     * Changer la coordonne de debut d'un bateau dans la grille.
     * Ne change pas le nombre d'actions restantes.
     * @param {Bateau} bateau_initial - Bateau a modifier.
     * @param {Coord} new_coord - Nouvelle coordonne de la case de debut du bateau
     * @param {Sens} [direction=bateau_initial.direction] - Direction du bateau
     **/
    changerCoordBateau(bateau_initial, new_coord,direction=bateau_initial.direction){
    this.grille.changerCoordBateau(bateau_initial, new_coord,direction)
    }

    
    /**
     * accede au bateau à un indice donné dans le tableau de bateaux_a_placer
     * et l'ajoute à la grille avec la coordonnée de debut.
     * Réduit le nombre d'actions restantes.
     * @param {number} indice_tab_bateau - Indice du bateau dans bateaux_a_placer.
     * @param {Coord} coord - Coordonnée de la case de debut du bateau.
     */
    ajouterBateauGrille(indice_tab_bateau, coord) {
    this.grille.ajouterBateauGrille(indice_tab_bateau, coord)
    }

    /**
     * Retourne si l'adversaire a perdu, c'est-à-dire si sa grille est vide.
     * @returns {boolean} - L'adversaire a-t-il perdu?
     */
    aGagne(){
        return this.grilleAdverse.estVide()
    }
}
export default Joueur