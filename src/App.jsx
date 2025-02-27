// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import { useState } from 'react';
import AfficheGrilleTire from './affichage/AfficheGrilleTire';
import './App.css';
import Bateau from './Bateau.js';
import Context from './Context.jsx';
import Direction from './Divers/Direction.js';
import Grille from './Grille.js';
import Jeu from './Jeu.js';

let grilleTest = new Grille(10,10);
let bateau = new Bateau("bateau1",3,Direction.HORIZONTAL,3,2)
let bateau2 = new Bateau("bateau2",3,Direction.HORIZONTAL,3,2)
Jeu.genererBateau(bateau,2,3,grilleTest)
Jeu.genererBateau(bateau2,2,3,grilleTest)
grilleTest.ajouterBateau(bateau)

/* eslint-disable react/prop-types */
export function ContextProvider({ children, grille }) {
  const [refresh,setRefresh] = useState(0)
  const forceRefresh = () => {
    setRefresh( refresh == 0 ? 1 : 0);
};

  return (
    <Context.Provider value={{grille,forceRefresh}}>
      {children}
    </Context.Provider>
  );
}




function App() {
  return (
    
    <ContextProvider grille={grilleTest} >   
    <div style={{display: 'flex', flexDirection: 'row'}}>
    {/* <AfficheGrillePlacage></AfficheGrillePlacage> */}
    <AfficheGrilleTire></AfficheGrilleTire>
    </div>
    </ContextProvider>
  )
}
export default App
