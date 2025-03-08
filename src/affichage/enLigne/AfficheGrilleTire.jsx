import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { client_socket } from "../../../connexion/client";
import JeuContext from "../../Context";
import Coord from "../../Divers/Coord";
import Ecran from "../../Divers/Ecran";
import Etat from "../../Divers/Etat";
import AfficheGrille from "../AfficheGrille";



function AfficheGrilleTire (){
    const {joueur,forceRefreshJeu,jeu,jeuRefresh} = useContext(JeuContext);
    const [abscisse,setAbscisse] = useState("A")
    const [ordonnee,setOrdonnee] = useState(1)
    const [localRefresh, setLocalRefresh] = useState(0);
    const peutTirer= useRef(true)
    const forceLocalRefresh = useCallback(() => {
      setLocalRefresh({});
    },[]);

    useEffect(() => {
      console.log("jeu tour joueur",jeu.tour_joueur)
      if(jeu.getJoueurActuel()==joueur){
        peutTirer.current=true 
      }
      else{
        peutTirer.current=false       
      }
      client_socket.onmessage = ({data: message}) => {
        const contenu_message=JSON.parse(message)
        console.log(contenu_message.type)
        if(contenu_message.type=="tirer"){
          jeu.getJoueurOppose(joueur).tirer(contenu_message.coord)

          if(jeu.getJoueurOppose(joueur).aGagne()){
            jeu.ecran=Ecran.GAGNER
            forceRefreshJeu()
            return
          }     
          jeu.change_tour_joueur()
          forceLocalRefresh()
          return
        }
        if(contenu_message.type=="deplacer"){
          const joueur_oppose=jeu.getJoueurOppose(joueur)
          joueur_oppose.deplacerBateau(joueur_oppose.grille.getCellule(contenu_message.coord).bateau,contenu_message.sens)
          jeu.change_tour_joueur()
          forceLocalRefresh()
          return
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [localRefresh,jeuRefresh]);

    function changeAbscisse({target}){
      const text=target.value  
      const text_to_abscisse=text.charCodeAt(0)-"A".charCodeAt(0)
      if(text.length==0 || (text.length==1 && text_to_abscisse<joueur.grille.largeur && text_to_abscisse>=0)){
        setAbscisse(target.value)
    }
  }

  function changeOrdonne({target}){
    const text_number=target.value
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
        if(cellule.bateau){
          return "bateau"
        }
      
        if(cellule.interdit>=1){
          return "interdit"
        }
        return "vide"
      }




      function tirerCellule(coord){
        if(peutTirer.current){
        peutTirer.current=false
        joueur.tirer(coord)
        client_socket.send(JSON.stringify({type:"tirer",coord:{x:coord.x,y:coord.y}}))
        if(joueur.aGagne()){
          jeu.ecran=Ecran.GAGNER
          forceRefreshJeu()
          return
        }
        jeu.change_tour_joueur()
        forceLocalRefresh()
      }
    }



      function tirerViaButton(){
        let copie_abscisse=abscisse
        let copie_ordonnee=ordonnee
        if(copie_abscisse!='' && copie_ordonnee!=''){
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
      <p> {joueur==jeu.joueur1 ? "joueur1" : "joueur2"}</p>
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