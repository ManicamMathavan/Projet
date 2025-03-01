class Joueur{
    constructor(grille,grilleAdverse){
        this.grille=grille
        this.grilleAdverse=grilleAdverse
    }

    tirer(coord){
        this.grilleAdverse.tirer(coord)
    }
    deplacerBateau(bateau_initial, coord_to_add) {
    this.grille.deplacerBateau(bateau_initial, coord_to_add)
    }
    changerCoordBateau(bateau_initial, new_coord,direction=bateau_initial.direction){
    this.grille.changerCoordBateau(bateau_initial, new_coord,direction)
    }
    ajouterBateauGrille(indice_tab_bateau, coord) {
    this.grille.ajouterBateauGrille(indice_tab_bateau, coord)
    }
    aGagne(){
        return this.grilleAdverse.estVide()
    }
}
export default Joueur