import { useContext } from "react";
import JeuContext from "../Context";
import ModeJeu from "../Divers/ModeJeu";


/**
 * Composant React affichant un menu permettant de choisir le mode de jeu en fonction de ModeJeu.
 * @return {JSX.Element} Composant React affichant le menu.
 */
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
            <button data-value={ModeJeu.EN_LIGNE_CLIENT} onClick={changeMode}>En Ligne Client</button>
        </>
    );
}
export default AfficheMenu