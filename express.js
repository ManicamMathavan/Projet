import express from 'express';
// import open from 'open';
import path from 'path';
import { fileURLToPath } from 'url';
import ip_server from './connexion/ip.js';
import startServer from './connexion/server.js';
const port_express=3000

// const a=5
// startServer()
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname,"dist")));

app.get("/start_server", (_, res) => {
  startServer()
  res.send("Server started");
});
app.listen(port_express,ip_server, () => {
    console.log("Server running on" +"http://"+ip_server+":3000.");
    // open("http://"+ip_server+":3000."); 
  });





  