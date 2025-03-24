import { useContext, useEffect, useRef, useState } from "react";
import JeuContext from "../../Context";
import Coord from "../../Divers/Coord";
import Ecran from "../../Divers/Ecran";
import Etat from "../../Divers/Etat";
import AfficheGrille from "../AfficheGrille";



function AfficheGrilleTire (){
    const {joueur,forceRefreshJeu,jeu,jeuRefresh} = useContext(JeuContext);

    //contient les ordonner et les abcisse si le joueur tire via coordoner
    const [abscisse,setAbscisse] = useState("A")
    const [ordonnee,setOrdonnee] = useState(1)
    const peutTirer= useRef(true)


    useEffect(() => {
      peutTirer.current=true
    }, [jeuRefresh]);

    function changeAbscisse({target}){
      const text=target.value  
      const text_to_abscisse=text.charCodeAt(0)-"A".charCodeAt(0)
      //verifie si le code ascci a bien une valeur comprise dans la grille 
      if(text.length==0 || (text.length==1 && text_to_abscisse<joueur.grille.largeur && text_to_abscisse>=0)){
        setAbscisse(target.value)
    }
  }

  //change la valeur de l'ordonner si elle est comprise dans la grille
  function changeOrdonne({target}){
    const text_number=target.value
    if(text_number.length==0 || text_number>=1 && text_number<=joueur.grille.hauteur){
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
        if(joueur.aGagne()){
          jeu.ecran=Ecran.GAGNER
          forceRefreshJeu()
          return;
        }

        if(jeu.change_tour_joueur()){
          while(jeu.joueur2.actions_restantes>0){
        jeu.joueur2.actionAleatoire()
          }

        jeu.change_tour_joueur()

        if(jeu.joueur2.aGagne()){
          jeu.change_tour_joueur()
          jeu.ecran=Ecran.GAGNER
          forceRefreshJeu()
          return;
        }
      }
        forceRefreshJeu()
      }
    }


    


      function tirerViaButton(){
        let copie_abscisse=abscisse
        let copie_ordonnee=ordonnee
        if(copie_abscisse!='' && copie_ordonnee!=''){

          /*on convertit les lettre de l'abscisse en nombre et on decremente l'ordonnee pour
          qu'il soit exploitable dans la grille et on tire a ces coordonnées*/
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
      <p> {jeu.tour_joueur == 1 ? "joueur1" : "joueur2"} nb de tour restant {joueur.actions_restantes}</p>
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