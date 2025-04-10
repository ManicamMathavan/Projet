import { useContext } from "react";
import JeuContext from "../../Context";
import Ecran from "../../Divers/Ecran";
import AfficheGagnant from "../2Joueur/AfficheGagnant";
import AfficheGrilleDeplace from "../2Joueur/AfficheGrilleDeplace";
import AfficheGrillePlace from "../2Joueur/AfficheGrillePlace";
import AfficheGrilleTire from "../2Joueur/AfficheGrilleTire";






//affiche la grille en fonction de l'attribut ecran de jeu
const Affiche2Joueur=()=> {
    const {jeu} = useContext(JeuContext);
     if (jeu.ecran == Ecran.AJOUTER) return <AfficheGrillePlace />;
     if(jeu.ecran==Ecran.GAGNER) return <AfficheGagnant/> ;
     if (jeu.ecran == Ecran.DEPLACER)return <AfficheGrilleDeplace />;
     if (jeu.ecran == Ecran.TIRER) return <AfficheGrilleTire />;
   }
export default Affiche2Joueur;
