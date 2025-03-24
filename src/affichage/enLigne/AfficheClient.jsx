import { useContext, useState } from "react";
import { client_socket, startClient } from "../../../connexion/client";
import Bateau from "../../Bateau";
import JeuContext from "../../Context";
import BateauNb from "../../Divers/BateauNb";
import Ecran from "../../Divers/Ecran";

//permet de se connecter en tapant l'adresse ip de l'hote
function AfficheClient() {
    const {jeu,forceRefreshJeu,joueur}=useContext(JeuContext)
    const [ipInput, setIpInput] = useState('');
    function connexion(){
        startClient(ipInput)

        client_socket.onopen= ()=>{
            client_socket.onmessage = ({data: message}) => {
                const contenu_message=JSON.parse(message)
    
                /*quand le serveur detecte 2 joueurs, il envoie un message "commencer" au client
                  le client coter serveur genere les bateaux par defaut et l'envoi au client*/
                if(contenu_message.type=="commencer" && jeu.estServer){
                    client_socket.send(JSON.stringify({type:"bateaux_a_placer",bateaux:joueur.grille.bateaux_a_placer}))
                    jeu.ecran=Ecran.AJOUTER
                    forceRefreshJeu()
                }
        
                /*
                quand le client recoit les bateaux du serveur, il les stocke dans la grille du joueur
                et affiche l'ecran pour placer les bateaux
                */
                if(contenu_message.type=="bateaux_a_placer"){
                    joueur.grille.bateaux_a_placer=(contenu_message.bateaux)
                    joueur.grille.bateaux_a_placer = contenu_message.bateaux.map(
                        (element) => new BateauNb(element.nb,new Bateau(element.bateau.nom,element.bateau.taille))
                      );
                    jeu.ecran=Ecran.AJOUTER
                    forceRefreshJeu()
                }
        
                /*si le client recoit un message "estServer" il change l'attribut estServer de jeu
                  lorsque le serveur rejoint le premier client dont l'adresse ip est la meme que la machine hote*/
                 else if(contenu_message.type=="estServer"){
                    jeu.estServer=true
                }
            }

         }
    }

    
    return (
        <>
    <input value={ipInput} onChange={(e) => setIpInput(e.target.value)} type="text"></input>
    <button onClick={connexion}>Connexion</button>
    </>
    )

}

export default AfficheClient;