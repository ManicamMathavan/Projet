import { useContext } from "react";
import JeuContext from "../Context.jsx";
import Coord from "../Divers/Coord.js";

/*eslint-disable react/prop-types */
function AfficheGrille({onClickCell,change_class,grille}){
    useContext(JeuContext)
    return (
       <div className="grille">
        {grille.grille.map((ligne, ligne_index) =>
        ligne.map((cellule,colonne_index) => (
          <div className= {change_class(cellule)}  key={`${ligne_index}-${colonne_index}`
          } onClick={()=>onClickCell({coord:new Coord(colonne_index,ligne_index), contenu:grille.getCellule(colonne_index,ligne_index)})}>
          </div>
            )
          )
        )}
      </div>

    )
}
export default AfficheGrille