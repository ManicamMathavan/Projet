import Bateau from "./Bateau.js";
import BateauNb from "./Divers/BateauNb.js";
import Ecran from "./Divers/Ecran.js";
import ModeJeu from "./Divers/ModeJeu.js";
import Grille from "./Grille.js";
import IA from "./IA.js";
import Joueur from "./Joueur.js";
class Jeu {
  #tour_joueur;
  #mode_jeu;
  constructor(grille) {
    const grille1 = new Grille(grille.largeur, grille.hauteur);
    const grille2 = new Grille(grille.largeur, grille.hauteur);
    this.joueur1 = new Joueur(grille1, grille2);
    this.joueur2 = new Joueur(grille2, grille1);
    this.#tour_joueur = 1;
    this.ecran;
    this.#mode_jeu=ModeJeu.AUCUN;
    this.estServer = false;
  }

  reset(){
    const {largeur,hauteur}=this.joueur1.grille
    const grille1 = new Grille(largeur, hauteur);
    const grille2 = new Grille(largeur, hauteur);
    this.joueur1 = new Joueur(grille1, grille2);
    this.joueur2 = new Joueur(grille2, grille1);
    this.#tour_joueur = 1;
    this.ecran;
    this.#mode_jeu=ModeJeu.AUCUN;
    this.estServer = false;
  }
  get mode_jeu() {
    return this.#mode_jeu;
  }

  get tour_joueur() {
    return this.#tour_joueur;
  }
  change_tour_joueur() {
    this.#tour_joueur = this.#tour_joueur == 1 ? 2 : 1;
  }

  /**
   * Génère un certain nombre de bateaux identiques à partir d'un bateau donné
   * vers une grille donnée pour initialiser le jeu avec un nombre de bateaux aléatoire
   * @param {Bateau} bateau - Bateau   partir duquel on va générer d'autres bateaux
   * @param {number} min - Nombre minimum de bateau à générer
   * @param {number} max - Nombre maximum de bateau à générer
   * @param {Grille} grille1 - Grille sur laquelle on va placer les bateaux
   */
  genererBateau(bateau, min, max) {
    const nb_bateau = Math.floor(Math.random() * (max - min + 1)) + min;
    if (nb_bateau > 0) {
      const copie_bateau1 = new Bateau(
        bateau.nom,
        bateau.taille,
        bateau.direction,
        bateau.case_x,
        bateau.case_y
      );
      const copie_bateau2 = new Bateau(
        bateau.nom,
        bateau.taille,
        bateau.direction,
        bateau.case_x,
        bateau.case_y
      );
      this.joueur1.grille.ajouterTabBateau(
        new BateauNb(nb_bateau, copie_bateau1)
      );
      this.joueur2.grille.ajouterTabBateau(
        new BateauNb(nb_bateau, copie_bateau2)
      );
    }
  }
  getJoueurOppose(joueur) {
    return joueur == this.joueur1 ? this.joueur2 : this.joueur1;
  }

  getJoueurActuel() {
    return this.#tour_joueur == 1 ? this.joueur1 : this.joueur2;
  }
  changer_mode_jeu(mode) {
    this.#mode_jeu = mode;
    if (mode == ModeJeu.DEUX_JOUEURS ) {
      if (!(this.joueur2 instanceof Joueur)) {
        this.joueur2 = new Joueur(
          this.joueur2.grille,
          this.joueur2.grilleAdverse
        );
      }
      this.ecran=Ecran.AJOUTER
      return;
    }

    if (mode == ModeJeu.EN_LIGNE ) {
        if (!(this.joueur2 instanceof Joueur)) {
          this.joueur2 = new Joueur(
            this.joueur2.grille,
            this.joueur2.grilleAdverse
          );
        }
        this.ecran=Ecran.ATTENTE
        return;
      }

    if (mode == ModeJeu.IA) {
      if (!(this.joueur2 instanceof IA)) {
        this.joueur2 = new IA(this.joueur2.grille, this.joueur2.grilleAdverse);
      }
      this.ecran=Ecran.AJOUTER
      return
    }
  }
}

export default Jeu;
