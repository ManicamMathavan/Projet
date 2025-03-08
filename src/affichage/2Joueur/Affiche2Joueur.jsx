import { useContext } from "react";
import JeuContext from "../../Context";
import JeuContextProvider from "../../ContextProvider";
import Ecran from "../../Divers/Ecran";
import AfficheGagnant from "../2Joueur/AfficheGagnant";
import AfficheGrilleDeplace from "../2Joueur/AfficheGrilleDeplace";
import AfficheGrillePlace from "../2Joueur/AfficheGrillePlace";
import AfficheGrilleTire from "../2Joueur/AfficheGrilleTire";
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
     if(jeu.ecran==Ecran.GAGNER) return <AfficheGagnant/> ;
     if (jeu.ecran == Ecran.DEPLACER)return <AfficheGrilleDeplace />;
     if (jeu.ecran == Ecran.TIRER) return <AfficheGrilleTire />;
   }
export default AfficheEnLigne;
