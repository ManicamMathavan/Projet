import os from 'os';

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (let interfaceName in interfaces) {
    for (let iface of interfaces[interfaceName]) {
      // Vérifie si c'est une adresse IPv4 et non une adresse de boucle locale
      if (iface.family === 'IPv4' && !iface.internal) {
        console.log("ip",iface.address)
        return iface.address;
      }
    }
  }
  return '127.0.0.1';  // Par défaut, retourne localhost
}
const ip_server=getLocalIP()

export default ip_server