import { createContext, useContext, useEffect, useRef, useState } from "react";
import { client_socket, closeClient } from "../../../connexion/client";
import Bateau from "../../Bateau";
import JeuContext from "../../Context";
import Direction from "../../Divers/Direction";
import Ecran from "../../Divers/Ecran";
import Etat from "../../Divers/Etat";
import ModeJeu from "../../Divers/ModeJeu";
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
  const [localRefresh, setLocalRefresh] = useState(0);

  /**
   * @type {Direction} direction du bateau a placer qu'on changera
   */
  const direction = useRef(Direction.HORIZONTAL);
  const forceLocalRefresh = () => {
    setLocalRefresh(localRefresh == 0 ? 1 : 0);
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

  const { jeu, forceRefreshJeu, jeuRefresh, joueur } = useContext(JeuContext);
  const {
    indiceBateauSelectionne,
    setIndiceBateauSelectionne,
    forceLocalRefresh,
    direction,
  } = useContext(LocalContext);

  //fait apparaitre les boutons quand tout les bateau sont placer
  const [peutCommencer, setPeutCommencer] = useState(false);
  const [boutonSelectionner, setBoutonSelectionner] = useState(null);
  const aEnvoyerMsg = useRef(false);
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

    /*le messsage pour commencer la partie est faux
    a chaque refresh du jeu mais pas au refreshlocal*/
    aEnvoyerMsg.current = false;

    client_socket.onmessage = ({ data: message }) => {
      const contenu_message = JSON.parse(message);

      /*quand les 2 joueur sont pret, ils envoient un message "commencer_tirer", puis s'envoi leur bateau_restants*/ 
      if (contenu_message.type == "commencer_tirer") {
        client_socket.send(
          JSON.stringify({ type: "grille", bateaux: joueur.grille.bateaux_restants })
        );
        return;
      }
      /*quand un joueur recoit les bateaux de l'autre joueur, il les ajoute a sa grille*/
      if (contenu_message.type == "grille") {
        const bateaux_adverse_actuel = joueur.grilleAdverse.bateaux_restants;
        const bateaux_adverse_recu=contenu_message.bateaux;
    
          //transformer le json en bateau et les ajouter a la grille
          bateaux_adverse_recu.forEach((bateau) => {
            const instance=new Bateau(bateau.nom,bateau.taille,bateau.direction,bateau.coord_debut.x,bateau.coord_debut.y)
            bateaux_adverse_actuel.push(instance);
            joueur.grilleAdverse.ajouterBateau(instance);
          })

          //initialiser les tour restants et commencer la partie
          jeu.init_tour_joueurs();
          console.log("jeu",jeu)
          jeu.ecran = Ecran.TIRER;
          forceRefreshJeu();
          return;
        }

        /*quand un des clients se deconnecte, on retourne au menu principal et le client se ferme*/
        if(contenu_message.type=="deconnexion"){
          jeu.changer_mode_jeu(ModeJeu.AUCUN)
          closeClient()
          forceRefreshJeu()
        }
      }
  
  }, [
    jeuRefresh,
    joueur.grille.bateaux_a_placer.length,
    jeu,
    forceRefreshJeu,
    joueur
  ]);

  //affiche une couleur selon le contenu de la grille
  function change_class(cellule) {
    if (cellule.etat == Etat.TOUCHER) return "toucher";
    if (cellule.etat == Etat.RATE) return "tirer";
    if (cellule.etat == Etat.COULER) return "couler";
    if (cellule.bateau) return "bateau";
    if (cellule.interdit >= 1) return "interdit";
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

    //deplace le bateau selectionné ou en selectionne un s'il est présent
    if (mode.current == Mode.DEPLACER) {
      if (bateau_selectionne.current == null) {
        bateau_selectionne.current = joueur.grille.getCellule(coord).bateau;
      } else {
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

  //change l'action de la souris et met en rouge le bouton correspondant au mode
  function changeMode(button_index, modeToChange) {
    mode.current = modeToChange;
    setBoutonSelectionner(button_index);
  }

  function joueurPret() {
    /*envoie un message au serveur pour dire que le joueur est pret
     quand on clique sur commencer (se declenche 1 fois) quand tout les
     clients sont pret, le serveur envoie un message "commencer_tirer"*/
    if (!aEnvoyerMsg.current) {
      client_socket.send(JSON.stringify({ type: "pret" }));
      aEnvoyerMsg.current = true;
      console.log(jeu)
    }
  }

  return (
    <>
      <p> {joueur == jeu.joueur1 ? "joueur1" : "joueur2"}</p>
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
      {peutCommencer && <button onClick={joueurPret}>Commencer</button>}
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

  //selectionne un bateau  en cliquant sur la liste
  const selectionnerBateau = (indice_list) => {
    const bateau = bateaux_a_placer[indice_list].bateau;
    setIndiceBateauSelectionne(indice_list);
    bateau.changer_direction(direction.current);
  };

  //change la direction du bateau qui va etre placer
  const changerDirection = ({ target }) => {
    direction.current =
      target.value == "horizontal" ? Direction.HORIZONTAL : Direction.VERTICAL;
    if (indiceBateauSelectionne != null) {
      const bateau = joueur.grille.bateaux_a_placer[indiceBateauSelectionne].bateau;
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
