import { useContext } from "react";
import JeuContext from "../../Context";
import JeuContextProvider from "../../ContextProvider";
import Ecran from "../../Divers/Ecran";
import AfficheAttente from "./AfficheAttente";
import AfficheGagnant from "./AfficheGagnant";
import AfficheGrilleDeplace from "./AfficheGrilleDeplace";
import AfficheGrillePlace from "./AfficheGrillePlace";
import AfficheGrilleTire from "./AfficheGrilleTire";

/*eslint-disable react/prop-types*/
function AfficheEnLigne({ jeu }) {
  return (
    <>
      <JeuContextProvider jeu={jeu}>
        <AfficheGrilleActuel/>
      </JeuContextProvider>
    </>
  );
}


//affiche la grille en fonction de l'attribut ecran de jeu
const AfficheGrilleActuel =()=> {
    const { jeu} = useContext(JeuContext);
    if (jeu.ecran == Ecran.AJOUTER) return <AfficheGrillePlace />;
    if (jeu.ecran == Ecran.TIRER) return <AfficheGrilleTire />;
    if (jeu.ecran == Ecran.DEPLACER) return <AfficheGrilleDeplace />;
    if(jeu.ecran==Ecran.GAGNER) return <AfficheGagnant/> ;
    return <AfficheAttente/>
  
    



   }
export default AfficheEnLigne;
