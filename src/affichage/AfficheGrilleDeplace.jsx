
import { useContext, useEffect, useRef, useState } from 'react';
import JeuContext from '../Context';
import Ecran from '../Divers/Ecran';
import Etat from '../Divers/Etat';
import Sens from '../Divers/Sens';
import AfficheGrille from './AfficheGrille';
function AfficheGrilleDeplace(){
    const {joueur,forceRefreshJeu,jeu,jeuRefresh} = useContext(JeuContext);
    const [bateauSelectionne,setBateauSelectionne]=useState(null)
    const [localRefresh, setLocalRefresh] = useState(0);
    const peutDeplacer= useRef(true)
    const forceLocalRefresh=()=>{setLocalRefresh(localRefresh==0?1:0)}

    useEffect(() => {
      peutDeplacer.current=true
    }, [jeuRefresh]);

    const sens=useRef(Sens.GAUCHE)

   function change_bateau_selectionne({contenu}){
        setBateauSelectionne(contenu.bateau)
    }

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

      function deplacerBateau(){
        if(bateauSelectionne && peutDeplacer.current){
            peutDeplacer.current=false
            jeu.ecran=Ecran.TIRER
            jeu.change_tour_joueur() 
            joueur.deplacerBateau(bateauSelectionne,sens.current)
            //afficher les changement
            forceLocalRefresh()
            //affiche l'ecran suivant apres 1 seconde
            setTimeout(() => {
              forceRefreshJeu()
            },1000)

        }
      }

      function AfficheEcranTirer(){
        jeu.ecran=Ecran.TIRER
        forceRefreshJeu()
      }


    return(
        <div>
            <p>{jeu.tour_joueur==1 ? "Joueur 1" : "Joueur 2"}</p>
            <AfficheGrille onClickCell={change_bateau_selectionne} change_class={change_class}
            grille={joueur.grille}/>

        <div>
        <label>
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
        <button onClick={AfficheEcranTirer}>Ecran Tire</button>
      </div>
     
      </div>
        </div>
    )

}

export default AfficheGrilleDeplace