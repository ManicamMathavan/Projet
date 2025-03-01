import { useContext } from "react";
import JeuContext from "../Context";
import JeuContextProvider from "../ContextProvider";
import Ecran from "../Divers/Ecran";
import AfficheGagnant from "./AfficheGagnant";
import AfficheGrilleDeplace from "./AfficheGrilleDeplace";
import AfficheGrillePlace from "./AfficheGrillePlace";
import AfficheGrilleTire from "./AfficheGrilleTire";
/*eslint-disable react/prop-types*/



function Affiche2Joueur({ jeu }) {
  return (
    <>
      <JeuContextProvider jeu={jeu}>
        <AfficheGrilleActuel/>
        {/* <AfficheGrilleTire></AfficheGrilleTire> */}
      </JeuContextProvider>
    </>
  );
}

const AfficheGrilleActuel =()=> {
    const { jeu} = useContext(JeuContext);

    if (jeu.ecran == Ecran.AJOUTER) {
      return <AfficheGrillePlace />;
    }
    
      if(jeu.ecran==Ecran.GAGNER) return <AfficheGagnant/> ;


     if (jeu.ecran == Ecran.DEPLACER) {
       return <AfficheGrilleDeplace />;
     }
     if (jeu.ecran == Ecran.TIRER) {
       return <AfficheGrilleTire />;
     }
   }
export default Affiche2Joueur;
