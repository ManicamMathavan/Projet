let client_socket=null
function startClient(){
client_socket= new WebSocket("ws://"+window.location.hostname+":8080");
client_socket.onopen = () => {
    console.log('Client connecté');
    client_socket.send(JSON.stringify("coucou"));
};
client_socket.onmessage = (message) => {
    const contenu_message=JSON.parse(message.data)
    console.log(`Message reçu client: ${contenu_message}`);
};
return client_socket

}




export { client_socket, startClient };

 