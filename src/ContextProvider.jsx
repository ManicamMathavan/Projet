import { useState } from "react";
import JeuContext from "./Context";

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
    const joueur=jeu.tour_joueur==1 ? jeu.joueur1 : jeu.joueur2
    const forceRefreshJeu = () => {
      setJeuRefresh( jeuRefresh == 0 ? 1 : 0);
  };
  
    return (
      <JeuContext.Provider value={{jeu,forceRefreshJeu,jeuRefresh,joueur,aGagner}}>
        {children}
      </JeuContext.Provider>
    );
  }

  export default JeuContextProvider
  

  // export function JoueurContextProvider({ children}) {
  //   const {jeu} = useContext(JeuContext)
  //   const joueur=jeu.tour_joueur==1 ? jeu.joueur1 : jeu.joueur2
  //   const [refresh,setRefresh] = useState(0)
  //   const forceRefreshJoueur = () => {
  //     setRefresh( refresh == 0 ? 1 : 0);
  //   }
  
  //     return (
  //       <JoueurContext.Provider value={{joueur,forceRefreshJoueur}}>
  //         {children}
  //       </JoueurContext.Provider>
  //     )
  // };
  