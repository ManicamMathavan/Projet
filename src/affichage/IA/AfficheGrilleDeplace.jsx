
import { useContext, useEffect, useRef, useState } from 'react';
import JeuContext from '../../Context';
import Ecran from '../../Divers/Ecran';
import Etat from '../../Divers/Etat';
import Sens from '../../Divers/Sens';
import AfficheGrille from '../AfficheGrille';
function AfficheGrilleDeplace(){

    //initialisation des variables
    const {joueur,forceRefreshJeu,jeu,jeuRefresh} = useContext(JeuContext);
    const [bateauSelectionne,setBateauSelectionne]=useState(null)
    const [localRefresh, setLocalRefresh] = useState(0);
    const peutDeplacer= useRef(true)
    const forceLocalRefresh=()=>{setLocalRefresh(localRefresh==0?1:0)}
    const sens=useRef(Sens.GAUCHE)

    //refresh peut deplacer quand le jeu refresh
    useEffect(() => {

      if(joueur.actions_restantes>0){
      peutDeplacer.current=true
      }else{
        peutDeplacer.current=false
      }
    }, [jeuRefresh,joueur.actions_restantes,localRefresh]);



    //quand le bateau est cliquer sur la grille elle est selectionne
   function change_bateau_selectionne({contenu}){
        setBateauSelectionne(contenu.bateau)
    }

    //changer le sens du bateau selectionne via bateauSelectionne
    function changerSens({target:{value}}){
        if(value=='gauche'){
            sens.current=Sens.GAUCHE
        }
        if(value=='droite'){
            sens.current=Sens.DROITE
        }
        if(value=='bas'){
            sens.current=Sens.BAS
        }
        if(value=='haut'){
            sens.current=Sens.HAUT
        }
    }

    //change la couleur de la cellule selon son etat
    function change_class(cellule){
        if(cellule.etat==Etat.TOUCHER){
          return "toucher"
        }
      
        if(cellule.etat==Etat.RATE){
          return "tirer"
        }
        if (cellule.etat==Etat.COULER){
          return "couler"
        }
        if(cellule.bateau){
          return "bateau"
        }
      
        if(cellule.interdit>=1){
          return "interdit"
        }
        return "vide"
      }


      //deplacer le bateauSelectionne
      function deplacerBateau(){
        if(bateauSelectionne && peutDeplacer.current){ 
            peutDeplacer.current=false
            joueur.deplacerBateau(bateauSelectionne,sens.current)

            //l'IA joue jusqu'a qu'elle n'ai plus d'action
            if(jeu.change_tour_joueur()){
              while(jeu.joueur2.actions_restantes>0){
            jeu.joueur2.actionAleatoire()
              }
            }
            jeu.change_tour_joueur()
            forceLocalRefresh()
          }
      
    }


      //affiche l'ecran de tire quand le bouton est cliqué
      function afficheEcranTirer(){
        jeu.ecran=Ecran.TIRER
        forceRefreshJeu()
      }


    return(
        <div>
            <p>{jeu.tour_joueur==1 ? "Joueur 1" : "Joueur 2"} nb action {joueur.actions_restantes}</p>
            <AfficheGrille onClickCell={change_bateau_selectionne} change_class={change_class}
            grille={joueur.grille}/>

        <div>
        <label>

          {/* affiche les option */}
          <input type="radio" name="sens" value={"gauche"}
          onChange={changerSens} defaultChecked/>
          gauche
        </label>
        <label>
          <input type="radio" name="sens" value={"droite"}
          onChange={changerSens} /> 
          droite
        </label>
        <div>
        <label>
          <input type="radio" name="sens" value={"bas"}
          onChange={changerSens}/>
          bas
        </label>
        <label>
          <input type="radio" name="sens" value={"haut"}
          onChange={changerSens} /> 
          haut
        </label>
        <button onClick={deplacerBateau}>Confirmer</button>
        <button onClick={afficheEcranTirer}>Ecran Tire</button>
      </div>
     
      </div>
        </div>
    )

}

export default AfficheGrilleDeplace