import Bateau from "./Bateau.js";
import BateauNb from "./Divers/BateauNb.js";
import Ecran from "./Divers/Ecran.js";
import ModeJeu from "./Divers/ModeJeu.js";
import NomBateau from "./Divers/NomBateau.js";
import Grille from "./Grille.js";
import IA from "./IA.js";
import Joueur from "./Joueur.js";


//genere la js doc

/**
 * Classe représentant un jeu de bataille navale.
 * @property {Joueur} joueur1 - Joueur 1
 * @property {Joueur} joueur2 - Joueur 2
 * @property {number} tour_joueur - numero du joueur dont c'est le tour
 * @property {ModeJeu} mode_jeu - Mode de jeu selectionné
 * @property {Ecran} ecran - Ecran actuel
 * @property {boolean} estServer - Vrai si le joueur est le serveur
 **/
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

  /**
   * Réinitialise le jeu.
   * Crée de nouvelles grilles, crée de nouveaux joueurs et remet les variables du jeu
   * à leur valeur initiale. l'attribut estServer est remis à false au cas ou il soit vrai
   * si la partie etait en ligne
   * @returns {void}
   */
  reset(){
    const {largeur,hauteur}=this.joueur1.grille
    const grille1 = new Grille(largeur, hauteur);
    const grille2 = new Grille(largeur, hauteur);
    this.joueur1 = new Joueur(grille1, grille2);
    this.joueur2 = new Joueur(grille2, grille1);

    this.#tour_joueur = 1;
    this.#mode_jeu=ModeJeu.AUCUN;
    this.estServer = false;
  }
  get mode_jeu() {
    return this.#mode_jeu;
  }

  get tour_joueur() {
    return this.#tour_joueur;
  }

  /**
   * Renvoie le joueur adverse du joueur actuel.
   * @returns {Joueur} - Le joueur adverse.
   */
  getJoueurAdverse(){
    return this.#tour_joueur==1 ? this.joueur2 : this.joueur1
  }
  
  /**
   * Change le tour du joueur actuel, si le joueur actuel a utilisé
   * toutes ses actions. Si le joueur actuel a des actions restantes,
   * ne fait rien.
   * @returns {boolean} - Vrai si le tour a été changé, faux sinon.
   */
  change_tour_joueur() {
    if(this.getJoueurActuel().actions_restantes<=0){
      this.getJoueurAdverse().initActionsRestantes()
    this.#tour_joueur = this.#tour_joueur == 1 ? 2 : 1;
    return true
    }
    return false
  }

  /**
   * change le tour du joueur sans prendre en compte les actions restantes.
   * @returns {void}
   */
  reverse_tour_joueur() {
    this.#tour_joueur = this.#tour_joueur == 1 ? 2 : 1;
  }

  /**
   * Génère un certain nombre de bateaux identiques à partir d'un bateau donné
   * vers une grille donnée pour initialiser le jeu avec un nombre de bateaux aléatoire
   * @param {Bateau} bateau - Bateau   partir duquel on va générer d'autres bateaux
   * @param {number} min - Nombre minimum de bateau à générer
   * @param {number} max - Nombre maximum de bateau à générer
   * @returns {void}
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
  
  /**
   * Renvoie le joueur opposé au joueur donné.
   * @param {Joueur} joueur - Le joueur pour lequel trouver l'opposé.
   * @returns {Joueur} Le joueur opposé.
   */

  getJoueurOppose(joueur) {
    return joueur == this.joueur1 ? this.joueur2 : this.joueur1;
  }

  /**
   * Renvoie le joueur actuel en fonction du tour du jeu.
   * @returns {Joueur} Le joueur actuel.
   */
  getJoueurActuel() {
    return this.#tour_joueur == 1 ? this.joueur1 : this.joueur2;
  }

  /**
   * Initialise le nombre d'actions restantes pour chaque joueur.
   * Utile au début d'un nouveau tour.
   * @returns {void}
   */
  init_tour_joueurs(){
    this.joueur1.initActionsRestantes()
    this.joueur2.initActionsRestantes()
  }
  /**
   * Changer le mode de jeu.
   * @param {ModeJeu} mode - mode de jeu
   * @returns {void}
   */
  changer_mode_jeu(mode) {
    this.#mode_jeu = mode;

    if (mode == ModeJeu.DEUX_JOUEURS ) {
      /*genere les bateaux quand le mode est selectionné et si le joueur2 est une ia 
      on le remet au type joueur*/
      this.genererBateauDefault();
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
      /*si le joueur2 est une ia on le remet au type joueur, les bateaux ne sont pas generés
        ici car on les genere une fois que la partie commence*/
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
      /*genere les bateaux quand le mode est selectionné et si le joueur2 est de type joueur 
      on le remet au type ia*/
      this.genererBateauDefault();
      if (!(this.joueur2 instanceof IA)) {
        this.joueur2 = new IA(this.joueur2.grille, this.joueur2.grilleAdverse);
      }
      this.ecran=Ecran.AJOUTER
      return
    }

    if (mode == ModeJeu.EN_LIGNE_CLIENT) {
      /*si le joueur2 est une ia on le remet au type joueur
        les bateaux ne sont pas generer car il seront recu par le serveur*/
      if (!(this.joueur2 instanceof Joueur)) {
        this.joueur2 = new Joueur(
          this.joueur2.grille,
          this.joueur2.grilleAdverse
        );
      }
      this.ecran=Ecran.CLIENT
      return
    }


  }

  /**
   * Genere un certain nombre de bateaux de differentes tailles pour commencer le jeu
   * en suivant l'énoncé du projet
   */
  genererBateauDefault(){
    this.genererBateau(new Bateau(NomBateau.PORTE_AVIONS, 5), 1, 2);
    this.genererBateau(new Bateau(NomBateau.CUIRASSE, 4), 0, 3);
    this.genererBateau(new Bateau(NomBateau.SOUS_MARIN, 3), 0, 3);
    this.genererBateau(new Bateau(NomBateau.DESTROYER, 3), 0, 3);
    this.genererBateau(new Bateau(NomBateau.PATROUILLEUR, 2), 0, 3);
  }

}

export default Jeu;
