// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import { useContext } from "react";
import { closeClient } from "../connexion/client.js";
import "./App.css";
import JeuContext from "./Context.jsx";
import JeuContextProvider from "./ContextProvider.jsx";
import Ecran from "./Divers/Ecran.js";
import ModeJeu from "./Divers/ModeJeu.js";
import Grille from "./Grille.js";
import Jeu from "./Jeu.js";
import Affiche2Joueur from "./affichage/2Joueur/Affiche2Joueur.jsx";
import AfficheMenu from "./affichage/AfficheMenu.jsx";
import AfficheIA from "./affichage/IA/AfficheIA.jsx";
import AfficheEnLigne from "./affichage/enLigne/AfficheEnLigne.jsx";
// import AfficheGrilleDeplace from './affichage/AfficheGrilleDeplace.jsx';

//import AfficheGrillePlacage from './affichage/AfficheGrillePlace.jsx';
//import AfficheGrilleTire from './affichage/AfficheGrilleTire.jsx';

let grilleTest = new Grille(10, 10);
let jeu = new Jeu(grilleTest);

jeu.ecran=Ecran.AJOUTER
function App() {
  return (
    <JeuContextProvider jeu={jeu}>
      <RetourMenuBoutton/>
      <AffichePrincipal/>
    </JeuContextProvider>
    // <AfficheIA jeu={jeu}/>
  );
}

function RetourMenuBoutton() {
  const {jeu,forceRefreshJeu}=useContext(JeuContext);
  function allerMenu() {    
  jeu.reset()
  closeClient()
  forceRefreshJeu()  

  }
 return <button onClick={allerMenu}>reset</button>;
}

function AffichePrincipal() {
  useContext(JeuContext);
  if(jeu.mode_jeu==ModeJeu.DEUX_JOUEURS) return <Affiche2Joueur/>;
  if(jeu.mode_jeu==ModeJeu.IA) return <AfficheIA />;
  if(jeu.mode_jeu==ModeJeu.EN_LIGNE || jeu.mode_jeu==ModeJeu.EN_LIGNE_CLIENT) return <AfficheEnLigne/>;
  if(jeu.mode_jeu==ModeJeu.AUCUN) return <AfficheMenu/>;
}
export default App;
