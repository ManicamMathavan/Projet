let client_socket=null


function startClient(ip=window.location.hostname){
client_socket= new WebSocket("ws://"+ip+":8080");
}

function closeClient(){
    if(client_socket!=null) client_socket.close()
}




export { client_socket, closeClient, startClient };

 