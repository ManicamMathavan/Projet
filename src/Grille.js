import Bateau from "./Bateau.js";
import Cellule from "./Cellule.js";
import Coord from "./Divers/Coord";
import Direction from "./Divers/Direction.js";
import Etat from "./Divers/Etat.js";
/**@typedef {import('./Divers/BateauNb.js')} BateauNb */

class Grille {
  #largeur;
  #hauteur;
  #grille;
  #bateaux_a_placer;
  #bateaux_restants;

  /**
   *
   * @param {number} [largeur=26] - largeur de la grille
   * @param {number} [hauteur=50] - hauteur de la grille
   * @param {BateauNb[]} [bateaux_a_placer] - tableau contenant les bateaux utiliser dans la grille
   * @param {Cellule[][]} [grille=remplirGrille()] - grille de jeu
   */
  constructor(largeur = 26, hauteur = 50) {
    this.#largeur = largeur;
    this.#hauteur = hauteur;
    this.#bateaux_a_placer = [];
    this.#bateaux_restants = [];
    this.#grille = this.remplirGrille(); //remplir la grille de cases vides
  }

  /**
   * Ajoute un bateau et son nombre dans la liste des bateaux à placer.
   * @param {BateauNb} bateauNb - Le bateau et son nombre à ajouter à la liste.
   */

  ajouterTabBateau(bateauNb) {
    this.#bateaux_a_placer.push(bateauNb);
  }

  /**
   * Retourne une case de la grille.
   * @param {number | Coord} x - coordonne x de la case, ou un objet Coord.
   * @param {number} [y] - coordonne y de la case, si x est un nombre.
   * @returns {Cellule} la case de la grille.
   */
  getCellule(x, y) {
    if (x.x != undefined && x.y != undefined) {
      return this.#grille[x.y][x.x];
    }
    return this.#grille[y][x];
  }

  /**
   * Retire 1 au nb de bateau du tableau bateaux_a_placer à l'indice selectionné.
   * Si le nombre de bateau est à 0, retire le bateau du tableau.
   ** @param {number} i - index du bateau à retirer dans bateau_a_placer
   */
  retirerTabBateau(i) {
    if (i < this.#bateaux_a_placer.length && i >= 0) {
      this.#bateaux_a_placer[i].nb--;
      if (this.#bateaux_a_placer[i].nb <= 0) {
        this.#bateaux_a_placer.splice(i, 1);
      }
    }
  }

/**
 * Ajoute un bateau à la grille à partir de l'indice donné de bateaux_a_placer.
 * Crée une copie du bateau avec les nouvelles coordonnées et l'ajoute à la grille si possible.
 * Si l'ajout est réussi, le bateau est déplacé dans la liste des bateaux restants
 * et retiré de la liste des bateaux à placer.
 * @param {number} indice_tab_bateau - Indice du bateau dans le tableau des bateaux à placer.
 * @param {Coord} coord - Coordonnée de la case de début du bateau.
 */

  ajouterBateauGrille(indice_tab_bateau, coord) {
    const bateau_selectionne = this.#bateaux_a_placer[indice_tab_bateau].bateau;
    const copie_bateau = new Bateau(
      bateau_selectionne.nom,
      bateau_selectionne.taille,
      bateau_selectionne.direction,
      coord.x,
      coord.y
    );

    if (this.ajouterBateau(copie_bateau)) {
      this.bateaux_restants.push(copie_bateau);
      this.retirerTabBateau(indice_tab_bateau);
    }
  }

  /**
   * deplacer un bateau dans la grille
   * @param {Bateau} bateau_initial - bateau a deplacer
   * @param {Sens} coord_to_add - direction du deplacement
   * @returns {boolean} - le bateau a t'il ete deplacer?
   */
  deplacerBateau(bateau_initial, coord_to_add) {
    const new_coord_debut = Coord.addCoord(
      bateau_initial.coord_debut,
      coord_to_add
    );
    const bateau_new_position = new Bateau(
      bateau_initial.nom,
      bateau_initial.taille,
      bateau_initial.direction,
      new_coord_debut.x,
      new_coord_debut.y
    );

    //verifier les conditions sur le nouveau bateau
    if (this.conditionBateau(bateau_new_position, bateau_initial)) {
      //retirer le bateau a la case de depart
      this.#retirerBateau(bateau_initial);

      //modifier la position du bateau et le placer a la nouvelle case
      bateau_initial.change_coord(new_coord_debut);
      this.ajouterBateau(bateau_initial);
      return true;
    }
    return false;
  }

  /**
   * Change la coordonne de debut d'un bateau dans la grille.
   * et l'ajoute a la grille si possible
   * @param {Bateau} bateau_initial - Bateau a modifier.
   * @param {Coord} new_coord - Nouvelle coordonne de la case de debut du bateau
   * @param {Sens} [direction=bateau_initial.direction] - Direction du bateau
   * @returns {boolean} - Le bateau a t'il ete deplacer?
   */
  changerCoordBateau(
    bateau_initial,
    new_coord,
    direction = bateau_initial.direction
  ) {
    const bateau_new_position = new Bateau(
      bateau_initial.nom,
      bateau_initial.taille,
      direction,
      new_coord.x,
      new_coord.y
    );

    //verifier les conditions sur le nouveau bateau
    if (this.conditionBateau(bateau_new_position, bateau_initial)) {
      //retirer le bateau a la case de depart
      this.#retirerBateau(bateau_initial);

      //modifier la position du bateau et le placer a la nouvelle case
      bateau_initial.change_coord(new_coord);
      bateau_initial.changer_direction(direction);
      this.ajouterBateau(bateau_initial);
      return true;
    }
    return false;
  }

  /**
   * Enleve un bateau de la grille sans toucher au tableau de bateaux
   * @param {Bateau} bateau - Bateau a enlever
   */
  #retirerBateau(bateau) {
    this.#appliquerFonctionSurBateau(bateau, (cellule) => {
      cellule.retirerBateau();
    });
  }

  /**
   * Tir sur une coordonnee
   * @param {Coord} coord - coordonnee du tir
   */
  tirer(coord) {
    if (this.#estContenu(coord)) {
      const cellule = this.getCellule(coord);
      const bateau_cellule = cellule.bateau;

      if (bateau_cellule == null) {
        cellule.etat = Etat.RATE;
        return false
      } else {
        this.#modifier_case_bateau_via_case_grille(coord, true);
        if (bateau_cellule.estDetruit()) {
          this.#detruireBateau(bateau_cellule);
          return true
        } else {
          cellule.etat = Etat.TOUCHER;
          return false
        }
      }
    }
  }

  /**
   * Vérifie si la grille est vide.
   * @returns {boolean} - La grille est-elle vide?
   */
  estVide() {
    return this.#bateaux_restants.length == 0;
  }

  get bateaux_restants() {
    return this.#bateaux_restants;
  }
  get bateaux_a_placer() {
    return this.#bateaux_a_placer;
  }

  get grille() {
    return this.#grille;
  }

  get largeur() {
    return this.#largeur;
  }

  /**
   * Met à jour le tableau des bateaux à placer à partir d'une chaîne JSON.
   * @param {string} json - Chaîne JSON représentant le tableau des bateaux à placer.
   */

  bateaux_a_placerFromJSON(json) {
    this.bateaux_a_placer=JSON.parse(json);
  }

  /**
   * Changer la dimension de la grille et mettre à jour la grille.
   * @param {number} largeur largeur de la grille
   * @param {number} hauteur hauteur de la grille
   */


  // changerDimension(largeur, hauteur) {
  //   this.#largeur = largeur;
  //   this.#hauteur = hauteur;
  //   this.#grille = this.remplirGrille();
  // }

  get hauteur() {
    return this.#hauteur;
  }
  set bateaux_a_placer(bateaux_a_placer) {
    this.#bateaux_a_placer = bateaux_a_placer;
  }

  /**
   * Retourne une grille de jeu, initialisée avec des cases vides.
   * @returns {Cellule[][]} une grille de jeu
   */
  remplirGrille() {
    return Array.from({ length: this.#hauteur }, () =>
      Array.from({ length: this.#largeur }, () => new Cellule())
    );
  }

  /**
   * Vérifie si la coordonnée est à l'intérieur de la grille.
   * @param {Coord} coord coordonnée à vérifier
   * @returns {boolean} true si la coordonnée est à l'intérieur de la grille
   */
  #estContenu(coord) {
    return (
      coord.x >= 0 &&
      coord.x < this.largeur &&
      coord.y >= 0 &&
      coord.y < this.hauteur
    );
  }

  /**
   * Vérifie si le bateau peut être placé sur la grille.
   * La méthode vérifie si le bateau ne dépasse pas de la grille,
   * et si les cases de la grille ne sont pas interdites.
   * Si un bateau est passé en paramètre, il est ignoré
   * dans les vérifications.
   * @param {Bateau} bateau bateau à vérifier
   * @param {Bateau} [bateau_a_ignore] bateau à ignorer dans les vérifications
   * @returns {boolean} true si le bateau peut être placé
   */
  conditionBateau(bateau, bateau_a_ignore = null) {
    //verifier si le bateau ne depasse pas de la grille
    if (
      this.#estContenu(bateau.coord_debut) == false ||
      this.#estContenu(bateau.coord_fin) == false
    ) {
      return false;
    }

    // si aucun bateau a ignorer
    if (bateau_a_ignore == null) {
      for (
        let pos_y = bateau.coord_debut.y;
        pos_y <= bateau.coord_fin.y;
        pos_y++
      ) {
        for (
          let pos_x = bateau.coord_debut.x;
          pos_x <= bateau.coord_fin.x;
          pos_x++
        ) {
          if (this.getCellule(pos_x, pos_y).interdit > 0) {
            return false;
          }
        }
      }
      return true;
    }

    // ne pas compter les cases du bateau a ignorer dans les conditions de placements
    for (
      let pos_y = bateau.coord_debut.y;
      pos_y <= bateau.coord_fin.y;
      pos_y++
    ) {
      for (
        let pos_x = bateau.coord_debut.x;
        pos_x <= bateau.coord_fin.x;
        pos_x++
      ) {
        const cellule = this.getCellule(pos_x, pos_y);
        const contenu_zone_interdite = bateau_a_ignore.estContenuInterdit(
          new Coord(pos_x, pos_y)
        );
        if (
          (cellule.interdit > 0 && !contenu_zone_interdite) ||
          (cellule.interdit > 1 && contenu_zone_interdite)
        ) {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * Détuit un bateau de la grille en le retirant du tableau bateaux_restants.
   * Met aussi à jour la grille en mettant les etats COULER dans les cases du bateau.
   * @param {Bateau} bateau - Le bateau a détruire
   */
  #detruireBateau(bateau) {
    const indice = this.#bateaux_restants.findIndex(
      (element) => element == bateau
    );
    this.#bateaux_restants.splice(indice, 1);
    //mettre a jour la grille
    this.#appliquerFonctionSurBateau(
      bateau,
      (cellule_interdit) => {
        cellule_interdit.retirerBateau();
      },
      (cellule_bateau) => {
        cellule_bateau.retirerBateau();
        cellule_bateau.etat = Etat.COULER;
      }
    );
  }

  /**
   * Applique une fonction sur les cases de la grille qui sont des zones interdites du bateau
   * et sur les cases qui sont le bateau lui meme.
   * @param {Bateau} bateau - Le bateau dont on applique la fonction sur ses zones interdites et sur lui meme.
   * @param {Function} fonction_zone_interdite - La fonction a appliquer sur les cases qui sont des zones interdites du bateau.
   * @param {Function} [fonction_case_bateau=fonction_zone_interdite] - La fonction a appliquer sur les cases qui sont le bateau lui meme.
   * Si elle n'est pas specifiee, alors c'est fonction_zone_interdite qui sera utilisee.
   */
  #appliquerFonctionSurBateau(
    bateau,
    fonction_zone_interdite,
    fonction_case_bateau = fonction_zone_interdite
  ) {
    for (
      let pos_y = bateau.coord_interdite_debut.y;
      pos_y <= bateau.coord_interdite_fin.y;
      pos_y++
    ) {
      for (
        let pos_x = bateau.coord_interdite_debut.x;
        pos_x <= bateau.coord_interdite_fin.x;
        pos_x++
      ) {
        if (this.#estContenu(new Coord(pos_x, pos_y))) {
          if (bateau.estContenu(new Coord(pos_x, pos_y))) {
            //appliquer la fonction si la case est un bateau
            fonction_case_bateau(this.getCellule(pos_x, pos_y));
          } else {
            //appliquer la fonction si la case est une zone interdite
            fonction_zone_interdite(this.getCellule(pos_x, pos_y));
          }
        }
      }
    }
  }

  /**
   * Ajoute un bateau sur la grille sans mettre à jour le tableau de bateaux.
   * @param {Bateau} bateau - Le bateau a ajouter.
   * @returns {boolean} - True si le bateau a ete ajoute, false sinon.
   */
  ajouterBateau(bateau) {
    //verifier si les conditions pour ajouter un bateau sont respectées
    if (!this.conditionBateau(bateau)) {
      return false;
    }
    this.#appliquerFonctionSurBateau(
      bateau,
      (cellule_interdit) => {
        cellule_interdit.interdit++;
      },
      (cellule_bateau) => {
        cellule_bateau.bateau = bateau;
        cellule_bateau.interdit++;
      }
    );
    return true;
  }

  /**
   * Modifie l'état de la case d'un bateau via ses coordonnées sur la grille.
   * Assigne la case associé au parametre aeur.
   * @param {Coord} coord - Les coordonnées de la case à modifier sur la grille.
   * @param {boolean} valeur - La valeur à assigner pour indiquer si la case est touchée (true) ou non (false).
   */
  #modifier_case_bateau_via_case_grille(coord, valeur) {
    const cellule = this.getCellule(coord);
    if (cellule.bateau != null) {
      const bateau_cellule = cellule.bateau;
      const bateau_cellule_debut = cellule.bateau.coord_debut;

      /*en fonction de la direction du bateau, on modifie la cases toucher du bateau*/
      if (bateau_cellule.direction == Direction.HORIZONTAL) {
        bateau_cellule.cases_est_touche[coord.x - bateau_cellule_debut.x] =
          valeur;
      } else {
        bateau_cellule.cases_est_touche[coord.y - bateau_cellule_debut.y] =
          valeur;
      }
    }
  }

}

export default Grille;
