import Bateau from "./Bateau";
import Coord from "./Divers/Coord";
import Direction from "./Divers/Direction";
import NomBateau from "./Divers/NomBateau";
import Sens from "./Divers/Sens";

/**
 * @property {number} actions_restantes - Nombre d'actions restantes de l'IA
 * @property {Grille} grille - Grille de l'IA
 * @property {Grille} grilleAdverse - Grille de l'adversaire
 **/
class IA {
  #actions_restantes;
  constructor(grille, grilleAdverse) {
    this.grille = grille;
    this.grilleAdverse = grilleAdverse;
    this.#actions_restantes;
  }

  get actions_restantes() {
    return this.#actions_restantes;
  }

  /**
   * Initialise le nombre d'actions restantes pour l'IA
   * par rapport à l'énoncer du projet
   * @returns {void}
   */
  initActionsRestantes() {
    let nb_action = 1;
    let porte_avions_trouve = false;
    this.grille.bateaux_restants.forEach((bateau) => {
      if (bateau.nom == NomBateau.PORTE_AVIONS) {
        porte_avions_trouve = true;
        nb_action += 1;
        return;
      }
      if (bateau.nom != NomBateau.PATROUILLEUR) {
        nb_action += 1;
        return;
      }
    });
    if (porte_avions_trouve) {
      this.#actions_restantes = nb_action;
    } else {
      this.#actions_restantes = 1;
    }
  }

  /**
   * Ajoute les bateaux restants de la grille de maniere aléatoire.
   * Les bateaux sont placés dans la grille en fonction de leur taille et de leur direction.
   * La direction du bateau est choisie aléatoirement parmi les 4 directions possibles.
   * @returns {void}
   */
  ajouterBateauAleatoire() {
    const directions_possibles = Object.values(Direction);
    while (this.grille.bateaux_a_placer.length != 0) {
      const bateaux_possibles = [];
      const premier_bateau_a_placer = this.grille.bateaux_a_placer[0].bateau;

        /*pour chaque case de la grille, on regarde si le premier_bateau_a_placer peut être placer
       si c'est le cas, on le garde dans bateaux_possibles*/
      for (let pos_y = 0; pos_y < this.grille.grille.length; pos_y++) {
        for (let pos_x = 0; pos_x < this.grille.grille[pos_y].length; pos_x++) {
          directions_possibles.forEach((direction_possible) => {
            const bateau_test = new Bateau(
              premier_bateau_a_placer.nom,
              premier_bateau_a_placer.taille,
              direction_possible,
              pos_x,
              pos_y
            );
            if (this.grille.conditionBateau(bateau_test)) {
              bateaux_possibles.push(bateau_test);
            }
          });
        }
      }
      //prendre un bateau aleatoire en accedant a un indice aleatoire
      const bateau_aleatoire =
        bateaux_possibles[Math.floor(Math.random() * bateaux_possibles.length)];

      //on met la direction du bateau a celui selecionné aleatoirement  
      premier_bateau_a_placer.changer_direction(bateau_aleatoire.direction);

      /*on met la coordonne de debut du bateau a celui selectionné aleatoirement
        On continue toute les étapes cités jusqu'a que la méthode ajouterBateauGrille vide le tableau
        bateau_a_placer*/
      this.grille.ajouterBateauGrille(0, bateau_aleatoire.coord_debut);
    }
  }

  /**
   * Effectue un déplacement aléatoire d'un bateau existant
   * dans la grille.
   * @returns {void}
   */
  deplacerBateauAleatoire() {
    const sens_possibles = Object.values(Sens);
    const bateaux_restants = this.grille.bateaux_restants;
    const bateaux_possibles = [];
    if (bateaux_restants.length != 0) {

    /*pour chacun des bateaux restants dans la grille, on creer un bateau qui prend tout
    les sens possibles et qui sera deplacer dans ces sens, s'il peut être déplacer on garde le sens
    auquelle il s'est déplacer et son indice dans le tableau des bateaux restants*/
      bateaux_restants.forEach((bateau, i) => {
        sens_possibles.forEach((sens_possible) => {
          const coord_bateau_test = Coord.addCoord(
            bateau.coord_debut,
            sens_possible
          );
          const bateau_test = new Bateau(
            bateau.nom,
            bateau.taille,
            bateau.direction,
            coord_bateau_test.x,
            coord_bateau_test.y
          );
          if (this.grille.conditionBateau(bateau_test, bateau)) {
            bateaux_possibles.push({ indice: i, sens: sens_possible });
          }
        });
      });

      /*prendre un sens possible aleatoire en accedant a un indice aleatoire */
      const donner_aleatoire =
        bateaux_possibles[Math.floor(Math.random() * bateaux_possibles.length)];

      /*deplacer le bateau à l'indice sauvegarder dans bateaux_restants dans le sens possible aleatoire */
      this.grille.deplacerBateau(
        bateaux_restants[donner_aleatoire.indice],
        donner_aleatoire.sens
      );
    }
  }
  /**
   * Retourne si la grille adverse est vide, c'est-à-dire si
   * l'adversaire a perdu.
   * @returns {boolean} - L'adversaire a-t-il perdu?
   */
  aGagne() {
    return this.grilleAdverse.estVide();
  }

  /**
   * Effectue un tir aléatoire sur la grille adverse.
   * @returns {void}
   */
  tirerAleatoire() {
    const x_aleatoire = Math.floor(
      Math.random() * this.grilleAdverse.grille.length
    );
    const y_aleatoire = Math.floor(
      Math.random() * this.grilleAdverse.grille[0].length
    );
    this.grilleAdverse.tirer(new Coord(x_aleatoire, y_aleatoire));
  }

  /**
   * Effectue une des actions aleatoire entre tirer aleatoire ou deplacer bateau aleatoire.
   * Réduit le nombre d'actions restantes.
   * @returns {void}
   */
  actionAleatoire() {
    //effectue une des actions aleatoire entre tirer aleatoire ou deplacer bateau aleatoire
    const aleatoire = Math.floor(Math.random() * 2);
    if (aleatoire == 0) {
      this.tirerAleatoire();
    } else {
      this.deplacerBateauAleatoire();
    }
    this.#actions_restantes -= 1;
  }
}

export default IA;
