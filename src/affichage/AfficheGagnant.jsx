import { useContext } from "react";
import JeuContext from "../Context";


function AfficheGagnant(){
    const {jeu} = useContext(JeuContext);
    return (
        <div>
            {jeu.tour_joueur==1 ? "Le gagnant est le joueur 1" : "Le gagnant est le joueur 2"}
        </div>
    )
}

export default AfficheGagnant