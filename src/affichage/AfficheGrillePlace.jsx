import { createContext, useContext, useRef, useState } from 'react';
import Context from '../Context';
import Direction from '../Divers/Direction';
import Etat from '../Divers/Etat';
import AfficheGrille from './AfficheGrille';




//creation du context
const GrilleContext=createContext();
    /*eslint-disable react/prop-types */
  function GrilleContextProvider({children}){
    const [indiceBateauSelectionne,setIndiceBateauSelectionne]= useState(null);
    const [refresh,setRefresh] = useState(0)
    const direction=useRef(Direction.HORIZONTAL)
    const forceRefresh = () => {
      setRefresh( refresh == 0 ? 1 : 0);
  };

     return (
       <GrilleContext.Provider value={{indiceBateauSelectionne,setIndiceBateauSelectionne,direction,forceRefresh}}>
         {children}
       </GrilleContext.Provider>
     );

     }

     //type enumerrer pour determnier action de la souris
     const Mode=Object.freeze({
      AJOUTER:Symbol("ajouter"),
      DEPLACER:Symbol("deplacer")})


  /**
   * Affiche une grille de jeu, ainsi que des boutons pour ajouter/deplacer des bateaux.
   * La grille est mise a jour en fonction des actions de l'utilisateur.
   * @returns {JSX.Element} un JSX Element representant la grille et les boutons.
   */
  function InitGrille(){
      const button_contenu=[{text:"Ajouter bateau",mode:Mode.AJOUTER},
        {text:"Deplacer bateau",mode:Mode.DEPLACER}]
    const {grille} = useContext(Context);
    const {indiceBateauSelectionne,setIndiceBateauSelectionne,forceRefresh,direction}= useContext(GrilleContext);

    const [peutCommencer,setPeutCommencer]=useState(false)
    const [boutonSelectionner,setBoutonSelectionner]=useState(null)
    const mode=useRef(Mode.AJOUTER)
    const bateau_selectionne=useRef(null)

    //affiche une couleur selon le contenu de la grille
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

      //gere les clique sur la grille
      function interagirGrille(coord){
        if (indiceBateauSelectionne!=null && mode.current==Mode.AJOUTER){
            grille.ajouterBateauGrille(indiceBateauSelectionne,coord)
            if(grille.bateaux_a_placer.length==0 && peutCommencer==false){
                setPeutCommencer(true)
              }
            setIndiceBateauSelectionne(null)
        }

        if (mode.current==Mode.DEPLACER){
          console.log(bateau_selectionne)
          if(bateau_selectionne.current==null){
            bateau_selectionne.current=grille.grille[coord.y][coord.x].bateau
          } else{
            grille.changerCoordBateau(bateau_selectionne.current,coord,direction.current)
            bateau_selectionne.current=null
            forceRefresh()
          }
        }



      }


      //change l'action de la souris
      function changeMode(index,modeToChange){
       mode.current=modeToChange
       setBoutonSelectionner(index)
      }
     console.log(grille)

  
    return (
      <>
      <AfficheGrille onClickCell={interagirGrille} change_class={change_class}></AfficheGrille>
      {/* affichage des boutons */}
       { button_contenu.map(({text,mode},index)=>
        <button key={index} onClick={()=>changeMode(index,mode)}
        style={{color: index === boutonSelectionner ? "red" : "black"}}
        >{text}</button>)}
      {peutCommencer && <button onClick={()=>setPeutCommencer(true)}>Commencer</button>}


      </>
      
  
    )
  }



/**
 * Affiche les bateaux qui n'ont pas encore ete placer sur la grille,
 * et permet de les selectionner pour les placer. Permet aussi de changer la
 * direction des bateaux.
 * @return {JSX.Element} Composant React affichant la liste des bateaux.
 */
  const AffichePlacage = () => {
    const { grille } = useContext(Context);
    const {setIndiceBateauSelectionne,indiceBateauSelectionne,direction}=useContext(GrilleContext)
    const bateaux_a_placer = grille.bateaux_a_placer;



    //selectionne un bateau  en cliquant sur la liste
  const selectionnerBateau = (indice) => {
    const bateau= grille.bateaux_a_placer[indice].bateau
        setIndiceBateauSelectionne(indice);
        bateau.changer_direction(direction.current)
        console.log(bateau.direction)
  }


  //change la direction du bateau qui va etre placer
  const changerDirection = ({target}) => {
    direction.current=(target.value=='horizontal'?Direction.HORIZONTAL:Direction.VERTICAL)
    if(indiceBateauSelectionne!=null){
    const bateau= grille.bateaux_a_placer[indiceBateauSelectionne].bateau
    bateau.changer_direction(direction.current)


    }
  }

  return (
    <>
      <div>
        <label>
          <input type="radio" name="direction" value={"horizontal"}
          onChange={changerDirection} defaultChecked/>
          horizontal
        </label>
        <label>
          <input type="radio" name="direction" value={"vertical"}
          onChange={changerDirection} /> 
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


  function AfficheGrillePlacage(){
    return (
      <>
       <GrilleContextProvider>
        <InitGrille/>
        <AffichePlacage></AffichePlacage>
       </GrilleContextProvider>
      </>
    
    )
  }



  export default AfficheGrillePlacage;
