import { useState } from "react";
import JeuContext from "./Context";
import Ecran from "./Divers/Ecran";
import ModeJeu from "./Divers/ModeJeu";

/*eslint-disable react/prop-types */


/**
 * Context provider pour le jeu
 * @property {Object} jeu - l'objet jeu
 * @property {function} forceRefreshJeu - fonction pour forcer le rafraichissement du jeu
 * @property {number} jeuRefresh - variable pour rafraichir le jeu
 * @property {Object} joueur - le joueur actuel (celui qui joue)
 * @property {boolean} aGagner - boolean pour savoir si le joueur a gagner
 */
 
function JeuContextProvider({ children, jeu }) {
    const [jeuRefresh,setJeuRefresh] = useState(0)
    const aGagner=false
    const joueur=init_joueur(jeu)
    const [ecran,setEcran]=useState(Ecran.MENU)
    console.log("joueur",joueur)
    const forceRefreshJeu = () => {
      setJeuRefresh({});
  };

  
    return (
      <JeuContext.Provider value={{jeu,forceRefreshJeu,jeuRefresh,joueur,aGagner,modeJeu: ecran,setModeJeu: setEcran}}>
        {children}
      </JeuContext.Provider>
    );
  }

  
/**
 * Initialise et retourne le joueur actuel en fonction du mode de jeu.
 * @param {Jeu} jeu - L'objet représentant le jeu courant.
 * @returns {Joueur} Le joueur actuel en fonction du mode de jeu:
 * - Si le mode est DEUX_JOUEURS, retourne le joueur du tour actuel.
 * - Si le mode est EN_LIGNE ou EN_LIGNE_CLIENT, retourne le joueur selon s'il est le serveur ou non.
 * - Si le mode est IA, retourne toujours joueur1.
 */

  function init_joueur(jeu){
    if(jeu.mode_jeu==ModeJeu.DEUX_JOUEURS){
      return jeu.tour_joueur==1 ? jeu.joueur1 : jeu.joueur2
    }
    if(jeu.mode_jeu==ModeJeu.EN_LIGNE || jeu.mode_jeu==ModeJeu.EN_LIGNE_CLIENT){
       return jeu.estServer ? jeu.joueur1 : jeu.joueur2
    }
    if(jeu.mode_jeu==ModeJeu.IA){
      return jeu.joueur1
    }

  }


  export default JeuContextProvider

  

