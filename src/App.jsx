// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'

import './App.css';
import Bateau from './Bateau.js';
import Coord from './Coord.js';
import Direction from './Direction.js';
import Grille from './Grille.js';

function change_class(cellule){

  if(cellule.tirer){
    return "tirer"
  }
  if(cellule.bateau){
    return "bateau"
  }
  if(cellule.interdit){
    return "interdit"
  }


  return "vide"
}

function Affiche_grille(){
   let grille = new Grille(10,10);
   const bateau=new Bateau("bateau1", 3,Direction.HORIZONTAL, 3, 2, grille)
   const bateau1=new Bateau("bateau1", 3,Direction.VERTICAL, 5, 4, grille)
   grille.ajouterBateau(bateau);
   grille.ajouterBateau(bateau1);
  grille.deplacerBateau(bateau,new Coord(0,2));
  //  grille.tirer(new Coord(0,0));
  // //  grille.tirer(new Coord(1,0));

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
