import { WebSocketServer } from "ws";
import ip_server from "./ip.js";

let server_socket= new WebSocketServer({port:8080, host:ip_server})
let clients_sockets=new Map()
const max_clients=2
let nb_client_pret=0
function startServer(){
server_socket.on('connection', (client_socket,req) => {
    
    const clientIP = req.socket.remoteAddress

    /*refuser la connexion si un client externe rejoint le serveur
    sans que l'hote n'ait ouvert le serveur*/
    if((clientIP!=ip_server && (clients_sockets.size==0)) || clients_sockets.size>=max_clients){
        console.log("fermer la socket client "+clientIP)
        client_socket.close()
        return;
    }

    //le client est le server s'il est le seul
    if(clients_sockets.size==0){
        client_socket.send(JSON.stringify({type:"estServer"}))
    }

    //ajouter le client a la map
    clients_sockets.set(client_socket,client_socket)

    //commencer le jeu quand il y a assez de joueurs
    if(clients_sockets.size==max_clients){
        console.log("pret")
    envoyerAuxClients({type:"commencer"})
    }

    console.log("ip client:",clientIP)
    console.log("ip serveur:",ip_server)


    client_socket.on('message', (message) => {
        const contenu_message=JSON.parse(message)
        console.log(`Message reçu: ${contenu_message}`);
    /*les client envoient un message quand ils sont pret et le serveur
    le sauvegarde dans*/
     if((contenu_message.type=="pret")){ 
        nb_client_pret++
     /*lorsque les joueur cliquent sur commencer quand il ont placer leur bateau
     un message est envoyé aux joueurs pour commencer le jeu*/
     if(nb_client_pret==max_clients){
        console.log("commencer le jeu")
        envoyerAuxClients({type:"commencer_tirer"})
        nb_client_pret=0
     }
    }
    if(contenu_message.type=="tirer" || contenu_message.type=="deplacer" || contenu_message.type=="grille"
        || contenu_message.type=="gagner"
    ){
        envoyerAuxClients(contenu_message,client_socket)
    }

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