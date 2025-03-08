import { useContext } from "react";
import { client_socket, startClient } from "../../../connexion/client";
import JeuContext from "../../Context";
import Ecran from "../../Divers/Ecran";

function AfficheAttente() {
    startClient()
    let client=client_socket
    const {jeu,forceRefreshJeu}=useContext(JeuContext)
    client.onmessage = ({data: contenu_message}) => {
        const type_message=JSON.parse(contenu_message).type
        if(type_message=="commencer"){
            jeu.ecran=Ecran.AJOUTER
            forceRefreshJeu()
        }
         else if(type_message=="estServer"){
            jeu.estServer=true
        }
    }

    return <div>Attente</div>;
}
export default AfficheAttente