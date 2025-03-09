import { useEffect, useState } from "react";
import JeuContext from "./Context";
import Ecran from "./Divers/Ecran";
import ModeJeu from "./Divers/ModeJeu";

/*eslint-disable react/prop-types */


  /**
   * permet de changer les attribut du jeu et de partager
   * sa valeur aux enfants, forceRefreshJeu met a jour le jeu
   * en fonction du parametre "jeu"
   * @param {{children: React.ReactNode, jeu: Jeu}} props les props du composant
   * @returns {JSX.Element} un JSX Element representant le contexte du jeu
   */
function JeuContextProvider({ children, jeu }) {
    const [jeuRefresh,setJeuRefresh] = useState(0)
    const aGagner=false
    const joueur=init_joueur(jeu)
    const [ecran,setEcran]=useState(Ecran.MENU)
    console.log("joueur",joueur)
    const forceRefreshJeu = () => {
      setJeuRefresh( jeuRefresh == 0 ? 1 : 0);
  };

  useEffect(() => {
    
  })
  
    return (
      <JeuContext.Provider value={{jeu,forceRefreshJeu,jeuRefresh,joueur,aGagner,modeJeu: ecran,setModeJeu: setEcran}}>
        {children}
      </JeuContext.Provider>
    );
  }

  function init_joueur(jeu){
    if(jeu.mode_jeu==ModeJeu.DEUX_JOUEURS){
      return jeu.tour_joueur==1 ? jeu.joueur1 : jeu.joueur2
    }
    if(jeu.mode_jeu==ModeJeu.EN_LIGNE){
       return jeu.estServer ? jeu.joueur1 : jeu.joueur2
    }
    if(jeu.mode_jeu==ModeJeu.IA){
      return jeu.joueur1
    }

  }


  export default JeuContextProvider

  

