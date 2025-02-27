import { useContext } from "react";
import Context from "../Context";
import Etat from "../Divers/Etat";
import AfficheGrille from "./AfficheGrille";



function AfficheGrilleTire (){
    const {grille,forceRefresh} = useContext(Context);

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

      function tirerCellule(coord){
        grille.tirer(coord)
        forceRefresh()
      }



    
    return (
      <AfficheGrille change_class={change_class} onClickCell={tirerCellule}></AfficheGrille>   
      )
}
export default AfficheGrilleTire;