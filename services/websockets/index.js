import { WebSocketServer } from 'ws';

let wsClientRef;

export default function initWebSockets(server) {
  const wss = new WebSocketServer({
    noServer: true,
    path: "/websockets",
  });

  server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (websocket) => {
      wss.emit('connection', websocket, request);
    });
  });

  wss.on('connection', (wsClient) => {
    console.log('Websocket connected!')

    wsClientRef = wsClient;

    wsClient.on('message', (message) => {
      console.log('WS message')
      const parsedMessage = JSON.parse(message);
      console.log(parsedMessage);
    });

    wsClient.on('error', (e) => { 
      console.log('WS connection error');
      console.log(e);
    });

    wsClient.on('close', () => {
      console.log('WS connection closed');
      wsClientRef = null;
    });
  });
}
