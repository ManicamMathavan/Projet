import Case from "./Case.js";
import Direction from "./Direction.js";
class Grille {
  #largeur;
  #hauteur;
  #grille;
  #bateaux;
  constructor(largeur = 26, hauteur = 50) {
    this.#largeur = largeur;
    this.#hauteur = hauteur;
    this.#bateaux = [];
    this.#grille = this.remplirGrille(); //remplir la grille de cases vides
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

  changerDimension(largeur, hauteur) {
    this.#largeur = largeur;
    this.#hauteur = hauteur;
    this.#grille = this.remplirGrille();
  }

  get hauteur() {
    return this.#hauteur;
  }


  remplirGrille() {
    return Array.from({ length: this.#hauteur }, () =>
      Array.from({ length: this.#largeur }, () => new Case())
    );
  }

  coordValide(coord) {
    return (
      coord.x >= 0 &&
      coord.x < this.largeur &&
      coord.y >= 0 &&
      coord.y < this.hauteur
    );
  }






  conditionBateau(bateau,valeur_interdite=0) {
    //verifier si le bateau ne depasse pas de la grille
    if (
      this.coordValide(bateau.case_debut) == false ||
      this.coordValide(bateau.case_fin) == false
    ) {
      return false;
    }

    // vérifier si le bateau ne chevauche pas une zone interdite horizontalement
    if (bateau.direction == Direction.HORIZONTAL) {
      for (let i = bateau.case_debut.x; i <= bateau.case_fin.x; i++) {
        if (
          this.grille[bateau.case_debut.y][i].interdit > valeur_interdite
        ) {
          return false;
        }
      }
    } else {
      for (let i = bateau.case_debut.y; i <= bateau.case_fin.y; i++) {
        if (
          this.grille[i][bateau.case_debut.x].interdit > valeur_interdite
        ) {
          return false;
        }
      }
    }
    return true;
  }



  appliquerFonctionSurBateau(bateau,fonction_zone_interdite,fonction_case_bateau=fonction_zone_interdite){ 

      for (let pos_y = bateau.case_interdite_debut.y; pos_y <= bateau.case_interdite_fin.y; pos_y++) {
        for( let pos_x=bateau.case_interdite_debut.x; pos_x<=bateau.case_interdite_fin.x; pos_x++){ 
          if(this.coordValide({x:pos_x, y:pos_y})) {
            if(bateau.coordValide({x:pos_x, y:pos_y})){         
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

 


  ajouterBateau(bateau) {

    //verifier si les conditions pour ajouter un bateau sont respectées
    if (!this.conditionBateau(bateau)) {
      return false;
    }

    this.#bateaux.push(bateau);

    this.appliquerFonctionSurBateau(bateau,
      (cellule_interdit) => {
        cellule_interdit.interdit++;
      },
      (cellule_bateau) => {
        console.log("bcezcz")
        cellule_bateau.bateau = bateau;
        cellule_bateau.interdit++;
      }
    );

    // if (bateau.direction == Direction.HORIZONTAL) {
    //   //parcourir les cases et les zone autour du bateau et les marquer comme interdites
    //   for (let pos_y = bateau.case_debut.y-1; pos_y <= bateau.case_fin.y+1; pos_y++) {
    //     for( let pos_x=bateau.case_debut.x-1; pos_x<=bateau.case_fin.x+1; pos_x++){
    //       if(this.coordValide({x:pos_x, y:pos_y})) {
    //         this.grille[pos_y][pos_x].interdit++;
    //         if(pos_y == bateau.case_debut.y && pos_x >= bateau.case_debut.x && pos_x <= bateau.case_fin.x){
    //           this.grille[pos_y][pos_x].bateau = bateau
    //         }
    //       }
    //     }
    //   }
    // } else {sss
    //   for (let i = bateau.case_debut.y; i <= bateau.case_fin.y; i++) {
    //     this.grille[i][bateau.case_debut.x].bateau = bateau;
    //   }
    // }
  
}
}

// const grille = new Grille();
// grille.ajouterBateau(
//   new Bateau("bateau1", 3, Direction.HORIZONTAL, 1, 1, grille)
// );
// console.log(grille.grille[0][0]);

// console.log(grille.grille);

export default Grille;