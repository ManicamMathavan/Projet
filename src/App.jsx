// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import "./App.css";
import Bateau from "./Bateau.js";
import Coord from "./Divers/Coord.js";
import Direction from "./Divers/Direction.js";
import Grille from "./Grille.js";
import Jeu from "./Jeu.js";
import Affiche2Joueur from "./affichage/Affiche2Joueur.jsx";
// import AfficheGrilleDeplace from './affichage/AfficheGrilleDeplace.jsx';

//import AfficheGrillePlacage from './affichage/AfficheGrillePlace.jsx';
//import AfficheGrilleTire from './affichage/AfficheGrilleTire.jsx';

let grilleTest = new Grille(10, 10);
let bateau = new Bateau("bateau1", 3, Direction.HORIZONTAL, 3, 2);
let bateau2 = new Bateau("bateau2", 3, Direction.HORIZONTAL, 3, 2);
let jeu = new Jeu(grilleTest);
jeu.genererBateau(bateau, 1, 1);
// jeu.genererBateau(bateau2, 1, 3);
jeu.joueur1.grille.ajouterBateau(bateau);
jeu.joueur1.grilleAdverse.ajouterBateau(bateau);
jeu.joueur1.tirer(new Coord(0,0))

function App() {
  
  return (
    // <p>test</p>
    <Affiche2Joueur jeu={jeu}/>
  );
}
export default App;
