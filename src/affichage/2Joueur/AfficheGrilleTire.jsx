import { useContext, useEffect, useRef, useState } from "react";
import JeuContext from "../../Context";
import Coord from "../../Divers/Coord";
import Ecran from "../../Divers/Ecran";
import Etat from "../../Divers/Etat";
import AfficheGrille from "../AfficheGrille";



function AfficheGrilleTire (){
    const {joueur,forceRefreshJeu,jeu,jeuRefresh} = useContext(JeuContext);

    /**
     * @type {string} - abscisse de la cellule à laquelle le joueur veut tirer
     */
    const [abscisse,setAbscisse] = useState("A")


    /**
     * @type {number} - ordonnee de la cellule à laquelle le joueur veut tirer
     */
    const [ordonnee,setOrdonnee] = useState(1)

    const [localRefresh, setLocalRefresh] = useState(0);
    const peutTirer= useRef(true)
    const forceLocalRefresh = () => {
      setLocalRefresh(localRefresh == 0 ? 1 : 0);
    };

    useEffect(() => {
      peutTirer.current=true
    }, [jeuRefresh]);

    function changeAbscisse({target}){


      const text=target.value  
      const text_to_abscisse=text.charCodeAt(0)-"A".charCodeAt(0)
      //si la lettre a un code ascii compris dans la grille ou change abscisse
      if(text.length==0 || (text.length==1 && text_to_abscisse<joueur.grille.largeur && text_to_abscisse>=0)){
        setAbscisse(target.value)
    }
  }

  function changeOrdonne({target}){
    const text_number=target.value
    //si le nombre est compris dans la grille (on verifie>1 et <=hauteur car le joueur commence à 1 mais la grille commence à 0)
    if(text_number.length=='' || text_number>=1 && text_number<=joueur.grille.hauteur){
      setOrdonnee(text_number)
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
        // if(cellule.bateau){
        //   return "bateau"
        // }
      
        // if(cellule.interdit>=1){
        //   return "interdit"
        // }
        return "vide"
      }




      function tirerCellule(coord){
        if(peutTirer.current){
        peutTirer.current=false
        joueur.tirer(coord)
        afficheEcranSuivant()
        forceLocalRefresh()
      }
    }

      function afficheEcranSuivant(){
        if(joueur.aGagne()){
          jeu.ecran=Ecran.GAGNER
          forceRefreshJeu()
          return;
        } else{
        //affiche l'ecran suivant
        if(jeu.change_tour_joueur()){
          setTimeout(() => {
            forceRefreshJeu()
          },1000)
        } else{
          forceRefreshJeu()
        }
        
        
      }
      }


      function tirerViaButton(){
        let copie_abscisse=abscisse
        let copie_ordonnee=ordonnee
        if(copie_abscisse!='' && copie_ordonnee!=''){

          //on convertit la lettre en abscisse et on enleve 1 à l'ordonnee car la grille commence à 0
          copie_abscisse=copie_abscisse.charCodeAt(0)-"A".charCodeAt(0)
          copie_ordonnee=parseInt(copie_ordonnee)-1
          tirerCellule(new Coord(copie_abscisse,copie_ordonnee))
        }
      }
      function tirerViaGrille({coord}){
        tirerCellule(coord)
      }
      function afficheEcranDeplace(){
        jeu.ecran=Ecran.DEPLACER
        forceRefreshJeu()
      }
      

    
    return (
      <>
      <p> {jeu.tour_joueur == 1 ? "joueur1" : "joueur2"}
          action restantes{joueur.actions_restantes}
      </p>
      <AfficheGrille change_class={change_class} onClickCell={tirerViaGrille} grille={joueur.grilleAdverse}></AfficheGrille>   
        <label htmlFor="abscisse">abscisse : </label>
        <input type="text" value={abscisse} onChange={(e) => changeAbscisse(e)} />
        <label htmlFor="abscisse">ordonne : </label>
        <input type="number" value={ordonnee} onChange={(e) => changeOrdonne(e)} />
        <button onClick={tirerViaButton}>Tirer</button>
        <button onClick={afficheEcranDeplace}>Ecran deplacement</button>
      </>
      )
}


export default AfficheGrilleTire;