import Bateau from "./Bateau"
import BateauNb from "./Divers/BateauNb"
 class Jeu{


    /**
     * Génère un certain nombre de bateaux identiques à partir d'un bateau donné
     * vers une grille donnée pour initialiser le jeu avec un nombre de bateaux aléatoire
     * @param {Bateau} bateau - Bateau   partir duquel on va générer d'autres bateaux
     * @param {number} min - Nombre minimum de bateau à générer
     * @param {number} max - Nombre maximum de bateau à générer
     * @param {Grille} grille1 - Grille sur laquelle on va placer les bateaux
     */
static genererBateau(bateau,min,max,grille1,grille2){
    const nb_bateau=Math.floor(Math.random() * (max - min + 1)) + min
    if(nb_bateau>0){
    const copie_bateau1=new Bateau(bateau.nom,bateau.taille,bateau.direction,bateau.case_x,bateau.case_y)
    // const copie_bateau2=new Bateau(bateau.nom,bateau.taille,bateau.direction,bateau.case_x,bateau.case_y)
    grille1.ajouterTabBateau(new BateauNb(nb_bateau,copie_bateau1))
    // grille2.ajouterTabBateau(new BateauNb(nb_bateau,copie_bateau2))
    }
}
}
 







export default Jeu
