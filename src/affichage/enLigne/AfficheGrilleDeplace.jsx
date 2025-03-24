
import { useContext, useEffect, useRef, useState } from 'react';
import { client_socket, closeClient } from '../../../connexion/client';
import JeuContext from '../../Context';
import Ecran from '../../Divers/Ecran';
import Etat from '../../Divers/Etat';
import ModeJeu from '../../Divers/ModeJeu';
import Sens from '../../Divers/Sens';
import AfficheGrille from "../AfficheGrille";
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
      if(jeu.getJoueurActuel()==joueur){
        peutDeplacer.current=true 
      }
      else{
        peutDeplacer.current=false       
      }
      client_socket.onmessage = ({data: message})=>{
        //effectue les actions reciproques aux joueurs adverse dans son propre jeu
        const contenu_message=JSON.parse(message)
        if(contenu_message.type=="tirer"){
          jeu.getJoueurOppose(joueur).tirer(contenu_message.coord)     
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
          jeu.reset()
          closeClient()
          forceRefreshJeu()
        }
      }
    //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [jeuRefresh,localRefresh]);



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
        /*verifie si le bateau est selectionne et si il peut etre deplacer
          puis le deplace et envoie la commande au serveur*/
        if(bateauSelectionne && peutDeplacer.current){
            peutDeplacer.current=false
            const dataToSend=JSON.stringify({type:"deplacer",coord:{x:bateauSelectionne.coord_debut.x,y:bateauSelectionne.coord_debut.y},sens:{x:sens.current.x,y:sens.current.y}})
            client_socket.send(dataToSend)    
            joueur.deplacerBateau(bateauSelectionne,sens.current)
            jeu.change_tour_joueur()
            setBateauSelectionne(null)
            //afficher les changement
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
            <p>{jeu.joueur1==joueur ? "Joueur 1" : "Joueur 2"}</p>
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