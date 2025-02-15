import Bateau from "./Bateau.js";
import Case from "./Case.js";
import Coord from "./Enum/Coord.js";
import Direction from "./Enum/Direction.js";
import Etat from "./Enum/Etat.js";
import Sens from "./Enum/Sens.js";
class Grille {
  
  #largeur;
  #hauteur;
  #grille;
  #bateaux;


  /**
   * 
   * @param {number} [largeur=26] - largeur de la grille
   * @param {number} [hauteur=50] - hauteur de la grille
   * @param {Bateau[]} [bateaux=[]] - tableau contenant les bateaux utiliser dans la grille
   * @param {Case[][]} [grille=remplirGrille()] - grille de jeu
   */
  constructor(largeur = 26, hauteur = 50) {
    this.#largeur = largeur;
    this.#hauteur = hauteur;
    this.#bateaux = [];
    this.#grille = this.remplirGrille(); //remplir la grille de cases vides
  }

  /**
   * deplacer un bateau dans la grille
   * @param {Bateau} bateau_initial - bateau a deplacer
   * @param {Sens} sens - direction du deplacement
   * @returns {boolean} - le bateau a t'il ete deplacer?
   */
  deplacerBateau(bateau_initial, sens) {
    console.log("rentrer");
    let coord_to_add
    if (sens == Sens.DROITE) {
      coord_to_add = new Coord(1, 0);
    } else if (sens == Sens.GAUCHE) {
      coord_to_add = new Coord(-1, 0);
    } else if (sens == Sens.HAUT) {
      coord_to_add = new Coord(0, -1);
    } else if (sens == Sens.BAS) {
      coord_to_add = new Coord(0, 1);
    }
    const new_coord_debut = Coord.addCoord(bateau_initial.coord_debut, coord_to_add);
    const bateau_new_position = new Bateau(bateau_initial.nom, bateau_initial.taille, bateau_initial.direction, new_coord_debut.x, new_coord_debut.y);
    //verifier les conditions sur le nouveau bateau
    if(this.#conditionBateau(bateau_new_position,1)){

        //retirer le bateau a la case de depart
        this.#retirerBateau(bateau_initial);

        //modifier la position du bateau et le placer a la nouvelle case
        bateau_initial.coord_debut=new_coord_debut;
        this.#ajouterBateau(bateau_initial);
        return true
     }
     return false
  }


  /**
   * Enleve un bateau de la grille sans toucher au tableau de bateaux
   * @param {Bateau} bateau - Bateau a enlever
   */
  #retirerBateau(bateau) {
    this.#appliquerFonctionSurBateau(bateau,
      (cellule) => {
        cellule.retirerBateau();
      }
    );
  }



  /**
   * Tir sur une coordonnee
   * @param {Coord} coord - coordonnee du tir
   */
  tirer(coord){
    if(this.#estContenu(coord)){
      const cellule=this.grille[coord.y][coord.x]
      const bateau_cellule=cellule.bateau;

      if (bateau_cellule==null){
        cellule.etat=Etat.RATE;
      } else{
        this.#modifier_case_bateau_via_case_grille(coord,true)
        if(bateau_cellule.estDetruit()){
          this.#detruireBateau(bateau_cellule)
        } else{
          cellule.etat=Etat.TOUCHER
        }

      }

      
    }
    
  }



  set bateaux(value) {
    this.#bateaux = value;
  }
  get bateaux() {
    return this.#bateaux;
  }

  get grille() {
    return this.#grille;
  }

  get largeur() {
    return this.#largeur;
  }

  /**
   * Changer la dimension de la grille et mettre à jour la grille.
   * @param {number} largeur largeur de la grille
   * @param {number} hauteur hauteur de la grille
   */
  changerDimension(largeur, hauteur) {
    this.#largeur = largeur;
    this.#hauteur = hauteur;
    this.#grille = this.remplirGrille();
  }

  /**
   * Retourne la hauteur de la grille.
   * @returns {number} hauteur de la grille
   */
  get hauteur() {
    return this.#hauteur;
  }


  /**
   * Retourne une grille de jeu, initialisée avec des cases vides.
   * @returns {Case[][]} une grille de jeu
   */
  remplirGrille() {
    return Array.from({ length: this.#hauteur }, () =>
      Array.from({ length: this.#largeur }, () => new Case())
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
   * Vérifie si un bateau peut être placé sur la grille, en tenant compte des zones interdites.
   * @param {Bateau} bateau bateau à vérifier
   * @param {number} [valeur_interdite=0] valeur d'interdit à vérifier (par défaut 0)
   * @returns {boolean} true si le bateau peut être placé sur la grille
   */
  #conditionBateau(bateau,valeur_interdite=0) {

    //verifier si le bateau ne depasse pas de la grille
    if (
      this.#estContenu(bateau.coord_debut) == false ||
      this.#estContenu(bateau.coord_fin) == false
    ) {

      return false;
    }

    // vérifier si le bateau ne chevauche pas une zone interdite horizontalement
    if (bateau.direction == Direction.HORIZONTAL) {
      for (let i = bateau.coord_debut.x; i <= bateau.coord_fin.x; i++) {
        if (
          this.grille[bateau.coord_debut.y][i].interdit > valeur_interdite
        ) {
          return false;
        }
      }
    } else {
      for (let i = bateau.coord_debut.y; i <= bateau.coord_fin.y; i++) {
        if (
          this.grille[i][bateau.coord_debut.x].interdit > valeur_interdite
        ) {
          return false;
        }
      }
    }
    return true;
  }


  /**
   * Détuit un bateau de la grille en modifiant le tableau de bateaux.
   * Met aussi à jour la grille en mettant les etats COULER dans les cases du bateau.
   * @param {Bateau} bateau - Le bateau a détruire
   */
  #detruireBateau(bateau) {
    //trouver l'index du bateau et le retirer du tableau
    const index=this.#bateaux.findIndex(element=>element==bateau)
    if(index!=-1) this.#bateaux.splice(index,1)

    //mettre a jour la grille
    this.#appliquerFonctionSurBateau(bateau,
      (cellule_interdit)=>{
      cellule_interdit.retirerBateau()
    },
      (cellule_bateau)=>{
      cellule_bateau.retirerBateau()
      cellule_bateau.etat=Etat.COULER
  })

}


  /**
   * Applique une fonction sur les cases de la grille qui sont des zones interdites du bateau
   * et sur les cases qui sont le bateau lui meme.
   * 
   * @param {Bateau} bateau - Le bateau dont on applique la fonction sur ses zones interdites et sur lui meme.
   * @param {Function} fonction_zone_interdite - La fonction a appliquer sur les cases qui sont des zones interdites du bateau.
   * @param {Function} [fonction_case_bateau=fonction_zone_interdite] - La fonction a appliquer sur les cases qui sont le bateau lui meme.
   * Si elle n'est pas specifiee, alors c'est fonction_zone_interdite qui sera utilisee.
   */
  #appliquerFonctionSurBateau(bateau,fonction_zone_interdite,fonction_case_bateau=fonction_zone_interdite){ 

      for (let pos_y = bateau.coord_interdite_debut.y; pos_y <= bateau.coord_interdite_fin.y; pos_y++) {
        for( let pos_x=bateau.coord_interdite_debut.x; pos_x<=bateau.coord_interdite_fin.x; pos_x++){ 
          if(this.#estContenu({x:pos_x, y:pos_y})) {
            if(bateau.estContenu({x:pos_x, y:pos_y})){         
            //appliquer la fonction si la case est un bateau  
            fonction_case_bateau(this.grille[pos_y][pos_x])
            } else{
            //appliquer la fonction si la case est une zone interdite
            fonction_zone_interdite(this.grille[pos_y][pos_x])
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
  #ajouterBateau(bateau) {
    //verifier si les conditions pour ajouter un bateau sont respectées
    if (!this.#conditionBateau(bateau)) {
      return false;
    }
    this.#appliquerFonctionSurBateau(bateau,
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
   * Ajoute un bateau sur la grille et le stock dans le tableau des bateaux.
   * @param {Bateau} bateau - Le bateau a ajouter.
   */
  ajouterBateauGrille(bateau){
    this.#bateaux.push(bateau);
    this.#ajouterBateau(bateau)
  }

/**
 * Modifie l'état de la case d'un bateau via ses coordonnées sur la grille.
 * Assigne la case associé au parametre valeur.
 * @param {Coord} coord - Les coordonnées de la case à modifier sur la grille.
 * @param {boolean} valeur - La valeur à assigner pour indiquer si la case est touchée (true) ou non (false).
 */
    #modifier_case_bateau_via_case_grille(coord,valeur){
      const cellule = this.grille[coord.y][coord.x]
      if(cellule.bateau!=null){
       const bateau_cellule=cellule.bateau;
       const bateau_cellule_debut=cellule.bateau.coord_debut
       bateau_cellule.cases_est_touche[coord.y-bateau_cellule_debut.y][coord.x-bateau_cellule_debut.x]=valeur
      }

    }


}


export default Grille;