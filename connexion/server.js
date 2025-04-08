import { WebSocketServer } from "ws";
import ip_server from "./ip.js";

let server_socket=null
let clients_sockets=new Set()
const max_clients=2
let nb_client_pret=0

function startServer(){
if(server_socket!=null) return;
server_socket=new WebSocketServer({port:8080, host:ip_server})
server_socket.on('connection', (client_socket) => {
    
    

    /*refuser la connexion si on depasse le maximum de joueurs*/
    if(clients_sockets.size>=max_clients){
        client_socket.close()
        return;
    }

    //le client est le server s'il est le seul
    if(clients_sockets.size==0){
        client_socket.send(JSON.stringify({type:"estServer"}))
    }

    //ajouter le client au set
    clients_sockets.add(client_socket)

    //commencer le jeu quand il y a assez de joueurs
    if(clients_sockets.size==max_clients){
    envoyerAuxClients({type:"commencer"})
    }



    client_socket.on('message', (message) => {
        const contenu_message=JSON.parse(message)
    /*les client envoient un message quand ils sont pret et le serveur
    le sauvegarde dans*/
     if((contenu_message.type=="pret")){ 
        nb_client_pret++

     /*lorsque les joueur cliquent sur commencer quand il ont placer leur bateau
     un message est envoyé aux joueurs pour commencer le jeu*/
     if(nb_client_pret==max_clients){
        envoyerAuxClients({type:"commencer_tirer"})
        nb_client_pret=0
     }
    }
    //renvoi les message recu des client aux autres clients pendant la partie
    if(contenu_message.type=="tirer" || contenu_message.type=="deplacer" || contenu_message.type=="grille"
        || contenu_message.type=="gagner" || contenu_message.type=="bateaux_a_placer"
    ){
        envoyerAuxClients(contenu_message,client_socket)
    }

    });

    //quand un client se ferme, les autre sont informé et se ferme à leur tour, le serveur est aussi fermé
    client_socket.on('close', () => {
        
        //ne fait rien si le client se ferme parce que joueur en trop tente de se connecter
        if(clients_sockets.size>max_clients) return
        clients_sockets.delete(client_socket)
        //demande aux clients de se deconnecter, une fois le serveur fermer, on ignore les déconnexion suivant celle du premier client
        if(server_socket==null) return
        envoyerAuxClients({type:"deconnexion"},client_socket)
        server_socket.close()
        server_socket=null
    });

    
})
}



function envoyerAuxClients(message,client_exeption){
    clients_sockets.forEach((client)=>{
        if(client_exeption==null || client!=client_exeption) {
            client.send(JSON.stringify(message));
        }
      })
    };




export default startServer