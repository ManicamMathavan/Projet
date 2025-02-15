// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'

import './App.css';
import Bateau from './Bateau.js';
import Coord from './Enum/Coord.js';
import Direction from './Enum/Direction.js';
import Etat from './Enum/Etat.js';
import Sens from './Enum/Sens.js';
import Grille from './Grille.js';
function change_class(cellule){

  if(cellule.etat==Etat.TOUCHER){
    return "toucher"
  }

  if(cellule.etat==Etat.RATE){
    return "tirer"
  }
  if (cellule.etat==Etat.COULER){
    return "couler"
  }
  if(cellule.bateau){
    return "bateau"
  }

  if(cellule.interdit>=1){
    return "interdit"
  }
  return "vide"
}

function Affiche_grille(){
   let grille = new Grille(10,10);
   const bateau=new Bateau("bateau1", 3,Direction.HORIZONTAL, 3, 2)
   grille.ajouterBateauGrille(bateau)
   grille.tirer(new Coord(3,2))
   grille.tirer(new Coord(4,2))
   grille.deplacerBateau(bateau,Sens.DROITE);
   grille.tirer(new Coord(6,2))
  //  grille.deplacerBateau(bateau,Sens.DROITE);

   console.log(grille.grille);
  return (
    <div className="grille">
      {grille.grille.map((ligne, ligne_index) =>
      ligne.map((cellule,colonne_index) => (
        <div className= {change_class(cellule)}  key={`${ligne_index}-${colonne_index}`}>
        </div>
          )
        )
      )}
    </div>
    

  )
}

function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
    <Affiche_grille/>
    </>
  )
}

export default App
