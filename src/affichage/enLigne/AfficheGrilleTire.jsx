import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { client_socket, closeClient } from "../../../connexion/client";
import JeuContext from "../../Context";
import Coord from "../../Divers/Coord";
import Ecran from "../../Divers/Ecran";
import Etat from "../../Divers/Etat";
import ModeJeu from "../../Divers/ModeJeu";
import AfficheGrille from "../AfficheGrille";


/** @typedef {import('../../Jeu').default} Jeu */
/** @typedef {import('../../Joueur').default} Joueur */




    /**
     * @function AfficheGrilleTire
     * @description Affiche la grille adverse pour le joueur actuel.
     * @param {Jeu} jeu Le jeu courant.
     * @param {Joueur} joueur Le joueur actuel.
     * 
     * @returns {JSX.Element} Un JSX Element representant la grille adverse.
     */
function AfficheGrilleTire (){
    const {joueur,forceRefreshJeu,jeu,jeuRefresh} = useContext(JeuContext);

    /**
     * @type {string} abscisse de la cellule a tirer
     */
    const [abscisse,setAbscisse] = useState("A")

    /**
     * @type {number} ordonnee de la cellule a tirer
     */
    const [ordonnee,setOrdonnee] = useState(1)

    const [localRefresh, setLocalRefresh] = useState(0);
    const peutTirer= useRef(true)
    const forceLocalRefresh = useCallback(() => {
      setLocalRefresh({});
    },[]);



    //a chaque refresh, si ce n'est pas le tour du joueur actuel, il ne peut pas tirer
    useEffect(() => {
        if(jeu.getJoueurActuel()==joueur){
        peutTirer.current=true 
      }
      else{
        peutTirer.current=false       
      }


      client_socket.onmessage = ({data: message}) => {
        //effectue les actions reciproques aux joueurs adverse dans son propre jeu

        const contenu_message=JSON.parse(message)
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
        if(contenu_message.type=="deconnexion"){
          jeu.changer_mode_jeu(ModeJeu.AUCUN)
          closeClient()
          jeu.reset()
          forceRefreshJeu()
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [localRefresh,jeuRefresh]);

    function changeAbscisse({target}){
      const text=target.value  
      const text_to_abscisse=text.charCodeAt(0)-"A".charCodeAt(0)
      //verifie que le code ascii du caractere est bien compris dans la grille
      if(text.length==0 || (text.length==1 && text_to_abscisse<joueur.grille.largeur && text_to_abscisse>=0)){
        setAbscisse(target.value)
    }
  }

  function changeOrdonne({target}){
    const text_number=target.value
    //verifie que le nombre est bien compris dans la grille (entre 1 et la hauteur de la grille mais la grille commence a 0)
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
        //tire et envoie un message au serveur pour informer du tire, le client adverse le recevra
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

          //met les valeur abscisse et ordonne en adequation avec la grille puis tire
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
      <p> {joueur==jeu.joueur1 ? "joueur1" : "joueur2"} action {joueur.actions_restantes} action adverse {jeu.getJoueurOppose(joueur).actions_restantes && "rien"}</p>
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