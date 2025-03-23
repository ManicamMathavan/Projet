import { createContext, useContext, useEffect, useRef, useState } from "react";
import JeuContext from "../../Context";
import Direction from "../../Divers/Direction";
import Ecran from "../../Divers/Ecran";
import Etat from "../../Divers/Etat";
import AfficheGrille from "../AfficheGrille";


function AfficheGrillePlace() {
  return (
    <>
      <LocalContextProvider>
        <InitGrille />
        <AffichePlacage />
      </LocalContextProvider>
    </>
  );
}

//creation du context local a ce fichier
const LocalContext = createContext();
/*eslint-disable react/prop-types */
function LocalContextProvider({ children }) {

  /**
   * @type {number} indice du bateau selectionne dans la liste des bateaux a placer
   */
  const [indiceBateauSelectionne, setIndiceBateauSelectionne] = useState(null);

  /**
   * @type {number} variable pour forcer le refresh du composant
   */
  const [, setLocalRefresh] = useState(0);

  /**
   * @type {Direction} direction du bateau a placer
   */
  const direction = useRef(Direction.HORIZONTAL);
  
  const forceLocalRefresh = () => {
    setLocalRefresh({});
  };

  return (
    <LocalContext.Provider
      value={{
        indiceBateauSelectionne,
        setIndiceBateauSelectionne,
        direction,
        forceLocalRefresh,
      }}
    >
      {children}
    </LocalContext.Provider>
  );
}

//type enumerer pour determiner action de la souris
const Mode = Object.freeze({
  AJOUTER: Symbol("ajouter"),
  DEPLACER: Symbol("deplacer"),
});

/**
 * Affiche une grille de jeu, ainsi que des boutons pour ajouter/deplacer des bateaux.
 * La grille est mise a jour en fonction des actions de l'utilisateur.
 * @returns {JSX.Element} un JSX Element representant la grille et les boutons.
 */
function InitGrille() {
  const button_contenu = [
    { text: "Ajouter bateau", mode: Mode.AJOUTER },
    { text: "Deplacer bateau", mode: Mode.DEPLACER },
  ];

  const { jeu, forceRefreshJeu,jeuRefresh, joueur } = useContext(JeuContext);
  const {
    indiceBateauSelectionne,
    setIndiceBateauSelectionne,
    forceLocalRefresh,
    direction,
  } = useContext(LocalContext);


  /**
   * @type {boolean} sert a faire apparaitre le bouton commencer si tout les bateaux sont placer
   */
  const [peutCommencer, setPeutCommencer] = useState(false);

  /**
   * @type {number} permet de mettre en rouge le bouton contenant le mode d'action (ajouter ou deplacer)
   */
  const [boutonSelectionner, setBoutonSelectionner] = useState(null);

  /**
   * @type {Mode} mode d'action de la souris (ajouter ou déplacer)
   */
  const mode = useRef(Mode.AJOUTER);


  const bateau_selectionne = useRef(null);


  /*fait apparaitre le bouton commencer quand tout les bateau sont placer
  à chaque render ou les retirer*/
  useEffect(() => {
    if (joueur.grille.bateaux_a_placer.length == 0) {
      setPeutCommencer(true);
    } else {
      setPeutCommencer(false);
    }

  },[jeuRefresh,joueur.grille.bateaux_a_placer.length])

  //affiche une couleur selon le contenu de la grille
  function change_class(cellule) {
    if (cellule.etat == Etat.TOUCHER)  return "toucher";
    if (cellule.etat == Etat.RATE)  return "tirer";
    if (cellule.etat == Etat.COULER) return "couler";
    if (cellule.bateau) return "bateau";
    if (cellule.interdit >= 1)  return "interdit";
    return "vide";
  }
  //gere les clique sur la grille
  function interagirGrille({ coord }) {

    if (indiceBateauSelectionne != null && mode.current == Mode.AJOUTER) {
      joueur.ajouterBateauGrille(indiceBateauSelectionne, coord);

      /*verifie si tout les bateau sont placer et fait apparaitre le bouton
      de commencer la partie*/
      if (
        joueur.grille.bateaux_a_placer.length == 0 &&
        peutCommencer == false
      ) {
        setPeutCommencer(true);
      }
      setIndiceBateauSelectionne(null);
    }

    //deplace le bateau selectionne ou en selectionne un s'il est présent
    if (mode.current == Mode.DEPLACER) {

      //si aucun bateau n'est selectionner, en selectionne un
      if (bateau_selectionne.current == null) {
        bateau_selectionne.current = joueur.grille.getCellule(coord).bateau;
      } else {
        //si un bateau est selectionne, on le deplace à l'endroit du clique
        joueur.grille.changerCoordBateau(
          bateau_selectionne.current,
          coord,
          direction.current
        );
        bateau_selectionne.current = null;
        forceLocalRefresh();
      }
    }
  }

  //change l'action de la souris
  function changeMode(button_index, modeToChange) {
    mode.current = modeToChange;
    setBoutonSelectionner(button_index);
  }

  function afficheEcranSuivant(){
    //change de tour si le joueur 1 joue
    if (jeu.tour_joueur == 1) {
      jeu.reverse_tour_joueur();

      /*change de tour et initialise les actions restantes des 2 joueur
      quand le joueur2 a placer ses bateaux, puis affiche l'ecran de tir pour commencer le jeu*/
    } else { 
      jeu.reverse_tour_joueur();
      jeu.init_tour_joueurs()
      jeu.ecran = Ecran.TIRER;
    }

    forceRefreshJeu();
  }

  return (
    <>
      <p> {jeu.tour_joueur == 1 ? "joueur1" : "joueur2"}</p>
      <AfficheGrille
        onClickCell={interagirGrille}
        change_class={change_class}
        grille={joueur.grille}
      ></AfficheGrille>
      {/* affichage des boutons */}
      {button_contenu.map(({ text, mode }, index) => (
        <button
          key={index}
          onClick={() => changeMode(index, mode)}
          style={{ color: index === boutonSelectionner ? "red" : "black" }}
        >
          {text}
        </button>
      ))}

      {/* button apparait si la liste des bateaux est vide */}
      {peutCommencer && (
        <button
          onClick={afficheEcranSuivant}
        >
          Commencer
        </button>
      )}
    </>
  );
}

/**
 * Affiche les bateaux qui n'ont pas encore ete placer sur la grille,
 * et permet de les selectionner pour les placer. Permet aussi de changer la
 * direction des bateaux.
 * @return {JSX.Element} Composant React affichant la liste des bateaux.
 */
const AffichePlacage = () => {
  const { joueur } = useContext(JeuContext);
  const { setIndiceBateauSelectionne, indiceBateauSelectionne, direction } =
  useContext(LocalContext);
  const bateaux_a_placer = joueur.grille.bateaux_a_placer;

  //selectionne un bateau en cliquant sur la liste et lui change sa direction
  const selectionnerBateau = (indice_list) => {
    const bateau = bateaux_a_placer[indice_list].bateau;
    setIndiceBateauSelectionne(indice_list);
    bateau.changer_direction(direction.current);
  };

  //change la direction du bateau qui va etre placer
  const changerDirection = ({ target }) => {
    direction.current = target.value 
    if (indiceBateauSelectionne != null) {
      const bateau = joueur.bateaux_a_placer[indiceBateauSelectionne].bateau;
      bateau.changer_direction(direction.current);
    }
  };

  return (
    <>
      <div>
        <label>
          <input
            type="radio"
            name="direction"
            value={"horizontal"}
            onChange={changerDirection}
            defaultChecked
          />
          horizontal
        </label>
        <label>
          <input
            type="radio"
            name="direction"
            value={"vertical"}
            onChange={changerDirection}
          />
          vertical
        </label>
      </div>

      {"["}
      {bateaux_a_placer.map((bateau, index) => (
        <span
          key={index}
          onClick={() => selectionnerBateau(index)}
          style={{ color: index === indiceBateauSelectionne ? "red" : "black" }}
        >
          {"{nom:" + bateau.bateau.nom + ", nb:" + bateau.nb + "}"}
          {index < bateaux_a_placer.length - 1 && ", "}
        </span>
      ))}
      <span>{"]"}</span>
    </>
  );
};



export default AfficheGrillePlace;
