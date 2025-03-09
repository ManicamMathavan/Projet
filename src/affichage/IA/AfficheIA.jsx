import { useContext } from "react";
import JeuContext from "../../Context";
import Ecran from "../../Divers/Ecran";
import AfficheGagnant from "../IA/AfficheGagnant";
import AfficheGrilleDeplace from "../IA/AfficheGrilleDeplace";
import AfficheGrillePlace from "../IA/AfficheGrillePlace";
import AfficheGrilleTire from "../IA/AfficheGrilleTire";







//affiche la grille en fonction de l'attribut ecran de jeu
const AfficheIA =()=> {
    const { jeu} = useContext(JeuContext);
     if (jeu.ecran == Ecran.AJOUTER) return <AfficheGrillePlace />;
     if(jeu.ecran==Ecran.GAGNER) return <AfficheGagnant/> ;
     if (jeu.ecran == Ecran.DEPLACER)return <AfficheGrilleDeplace />;
     if (jeu.ecran == Ecran.TIRER) return <AfficheGrilleTire />;
   }
export default AfficheIA;
