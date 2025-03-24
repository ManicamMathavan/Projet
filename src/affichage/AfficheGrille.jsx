import { useContext } from "react";
import JeuContext from "../Context.jsx";
import Coord from "../Divers/Coord.js";

/*eslint-disable react/prop-types */

/**
 * @param {function} onClickCell - fonction pour gérer le click sur une cellule
 * @param {function} change_class - fonction pour changer pour rendre visible ou non les element de la grille
 * @param {Grille} grille - la grille à afficher
 */
function AfficheGrille({ onClickCell, change_class, grille }) {
  useContext(JeuContext);
  const tabLargeur = tabChar({ nb: grille.largeur });
  const tabHauteur = tabNb({ nb: grille.hauteur });
  return (
    <>
      <div style={{ display: "grid", gridTemplateRows: `repeat(${2}, auto` }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${grille.largeur}, 50px)`,
            justifyItems: "center",
          }}
        >
          {tabLargeur.map((i) => (
            <div key={i} style={{marginLeft: "2em"}}>{i}</div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: `repeat(${2}, 1fr` }}>
          <div
            style={{
              display: "grid",
              gridTemplateRows: `repeat(${grille.hauteur}, 50px)`,
              alignItems: "center",
              justifyItems: "center",
            }}
          >
            {tabHauteur.map((i) => (
              <div key={i}>{i}</div>
            ))}
          </div>
          <div className="grille">
            {grille.grille.map((ligne, ligne_index) =>
              ligne.map((cellule, colonne_index) => (
                <div
                  className={change_class(cellule)}
                  key={`${ligne_index}-${colonne_index}`}
                  onClick={() =>
                    onClickCell({
                      coord: new Coord(colonne_index, ligne_index),
                      contenu: grille.getCellule(colonne_index, ligne_index),
                    })
                  }
                ></div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function tabNb({ nb }) {
  const element = [];
  for (let i = 1; i <= nb; i++) {
    element.push(i);
  }
  return element;
}
function tabChar({ nb }) {
  const element = [];
  for (let i = 0; i < nb; i++) {
    element.push(String.fromCharCode("A".charCodeAt(0) + i));
  }
  return element;
}
export default AfficheGrille;
