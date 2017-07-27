
const express = require('express');
const SocketServer = require('ws').Server;

// Set the port to 3001
const PORT = 3001;

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new SocketServer({ server });

// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', function incoming(data) {
    var message = JSON.parse(data)
    console.log("Name", message.username,"says", message.content);
    if (message.type === 'postMessage') {
      message.type = 'incomingMessage';
    } else if (message.type === 'postNotification') {
      message.type = 'incomingNotification';
    }

      broadcast(message);
  ;});
  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => console.log('Client disconnected'));
});

function broadcast(msg) {
  console.log(msg)
  for(let client of wss.clients) {

    // console.log('We are at ' + wss.clients.size + ' clients!');
    // console.log("this is the parsed data",JSON.parse(daVta).type);
    // if(JSON.parse(data).type === 'postMessage'){
    //     JSON.parse(data).type = 'incomingMessage';
    // }
    client.send(JSON.stringify(msg));
  }
}
