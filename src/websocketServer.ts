/* Libraries */
import WebSocket from 'ws';
import http from "http";

/* Application Module */
import { logger } from './config/logger';
import { app } from './config/app';
import config from './config/appConfig';

interface BroadcastMessage {
  post_id: string;
  type: string;
  message: string;
}

const server = http.createServer(app).listen(config.ws_port);
const wss = new WebSocket.Server({ server });

// connected client store
const clients: WebSocket[] = [];

const broadcastMessage = (data: BroadcastMessage) => {
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  })
}

wss.on('connection', (ws: WebSocket) => {
  // Add the newly connected client to the list
  clients.push(ws);

  ws.on('close', () => {
    // Remove the disconnected client from the list
    logger.info("client disconnected");
    const index = clients.indexOf(ws);
    if (index !== -1) {
      clients.splice(index, 1);
    }
  });
});

export { broadcastMessage };