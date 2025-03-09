import { useContext } from "react";
import JeuContext from "../Context";
import ModeJeu from "../Divers/ModeJeu";


function AfficheMenu() {
    const {forceRefreshJeu,jeu}=useContext(JeuContext)
    function changeMode({target}) {
        jeu.changer_mode_jeu(target.getAttribute("data-value"))
        console.log(jeu.mode_jeu)
        forceRefreshJeu()
    }

    return (
        <>
            <button data-value={ModeJeu.DEUX_JOUEURS} onClick={changeMode}>2 Joueur</button>
            <button data-value={ModeJeu.IA} onClick={changeMode}>IA</button>
            <button data-value={ModeJeu.EN_LIGNE} onClick={changeMode}>En Ligne</button>
        </>
    );
}
export default AfficheMenu