import { useContext } from "react";
import { client_socket, startClient } from "../../../connexion/client";
import JeuContext from "../../Context";
import Ecran from "../../Divers/Ecran";

function AfficheAttente() {
    startClient()
    let client=client_socket
    const {jeu,forceRefreshJeu,joueur}=useContext(JeuContext)
    client.onmessage = ({data: message}) => {
        const contenu_message=JSON.parse(message)

        if(contenu_message.type=="commencer" && jeu.estServer){

            client_socket.send(JSON.stringify({type:"bateaux_a_placer",bateaux:joueur.grille.bateaux_a_placer}))
            console.log("message",JSON.stringify({type:"bateaux_a_placer",bateaux:joueur.grille.bateaux_a_placer}));
            jeu.ecran=Ecran.AJOUTER
            forceRefreshJeu()
        }

        if(contenu_message.type=="bateaux_a_placer"){
            console.log("message recu",contenu_message.bateaux);
            joueur.grille.bateaux_a_placer=(contenu_message.bateaux)
            jeu.ecran=Ecran.AJOUTER
            forceRefreshJeu()
        }

         else if(contenu_message.type=="estServer"){
            jeu.estServer=true
        }
    }

    return <div>Attente</div>;
}
export default AfficheAttente