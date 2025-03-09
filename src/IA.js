import Bateau from "./Bateau"
import Coord from "./Divers/Coord"
import Direction from "./Divers/Direction"
import Sens from "./Divers/Sens"

class IA {
    constructor(grille,grilleAdverse){
        this.grille=grille
        this.grilleAdverse=grilleAdverse
    }

    ajouterBateauAleatoire(){
        const directions_possibles= Object.values(Direction)
        console.log("bateaux a placer",this.grille.bateaux_a_placer)
         while(this.grille.bateaux_a_placer.length!=0){
        const bateaux_possibles=[]
        const premier_bateau_a_placer=this.grille.bateaux_a_placer[0].bateau
       // const direction_aleatoire=direction_possible[Math.floor(Math.random()*direction_possible.length)]
        for(let pos_y=0;pos_y<this.grille.grille.length;pos_y++){
            for(let pos_x=0;pos_x<this.grille.grille[pos_y].length;pos_x++){
                directions_possibles.forEach((direction_possible)=>{
                    const bateau_test=new Bateau(premier_bateau_a_placer.nom,premier_bateau_a_placer.taille,direction_possible,pos_x,pos_y)
                    if(this.grille.conditionBateau(bateau_test)){
                        console.log("bateau_test",bateau_test)
                        bateaux_possibles.push(bateau_test)
                    }
                })
            }
        }
        //prendre un bateau aleatoire en accedant a un indice aleatoire
        const bateau_aleatoire=bateaux_possibles[Math.floor(Math.random()*bateaux_possibles.length)]
        premier_bateau_a_placer.changer_direction(bateau_aleatoire.direction)
        console.log("bateaux_possibles",bateaux_possibles)
        this.grille.ajouterBateauGrille(0,bateau_aleatoire.coord_debut)
   }
}

    deplacerBateauAleatoire(){
        const sens_possibles=Object.values(Sens)
        const bateaux_restants=this.grille.bateaux_restants
        const bateaux_possibles=[]
        if(bateaux_restants.length!=0){
        bateaux_restants.forEach((bateau,i)=>{
        sens_possibles.forEach((sens_possible)=>{
            const coord_bateau_test=Coord.addCoord(bateau.coord_debut,sens_possible)
            const bateau_test=new Bateau(bateau.nom,bateau.taille,bateau.direction,coord_bateau_test.x,coord_bateau_test.y)
            if(this.grille.conditionBateau(bateau_test,bateau)){
                bateaux_possibles.push({indice:i,sens:sens_possible})
            }
        })
        })
        const donner_aleatoire=bateaux_possibles[Math.floor(Math.random()*bateaux_possibles.length)]
        this.grille.deplacerBateau(bateaux_restants[donner_aleatoire.indice],donner_aleatoire.sens)
    }
}
    aGagne(){
        return this.grilleAdverse.estVide()
    }

    tirerAleatoire(){
        const x_aleatoire=Math.floor(Math.random()*this.grilleAdverse.grille.length)
        const y_aleatoire=Math.floor(Math.random()*this.grilleAdverse.grille[0].length)
        this.grilleAdverse.tirer(new Coord(x_aleatoire,y_aleatoire))
    }

    actionAleatoire(){
        //effectue une des actions aleatoire entre tirer aleatoire ou deplacer bateau aleatoire
        const aleatoire=Math.floor(Math.random()*2)
        if(aleatoire==0){
            this.tirerAleatoire()
        }else{
            this.deplacerBateauAleatoire()
        }
    }

}

export default IA