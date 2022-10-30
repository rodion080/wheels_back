import { Injectable } from "@nestjs/common";
import * as _ws from "ws";

enum TypeChatMessage {
  // eslint-disable-next-line no-unused-vars
  GLOBAL = 'GLOBAL',
  // eslint-disable-next-line no-unused-vars
  PERSONAL = 'PERSONAL',
}

type TypeChatResponse = {
  readonly  messageType: TypeChatMessage.GLOBAL | TypeChatMessage.PERSONAL,
  readonly  login: string,
  readonly  message: string,
}

@Injectable()
export class WsService {
    constructor() {
        const PORT = 7003;
        const wss = new _ws.WebSocketServer({
            port: PORT
        }, () => console.log(`Server is launched. PORT=${PORT}`));

        wss.on("connection", function(ws, request, client) {
            ws.on("message", (message) => {
                message = JSON.parse(message);
                const { userId, login, mess } = message;

                switch (message.event) {
                case "broadcastNeighbours":
                    console.log(mess);
                    broadcastNeighbours(login, mess, ws);
                    break;
                case "broadcastAll":
                    console.log(mess);
                    broadcastAll(login, mess, ws);
                    break;
                default:
                    console.log("username");
                    // broadcastMessage(message);
                    break;
                }
            });
        });

        function broadcastAll(login, message, ws) {
            wss.clients.forEach(function each(client) {
                const obj : TypeChatResponse = { messageType: TypeChatMessage.PERSONAL, login, message };
                if (client !== ws && client.readyState === _ws.OPEN) {
                    client.send(JSON.stringify(obj));
                } else if (client === ws && client.readyState === _ws.OPEN) {
                    client.send(JSON.stringify(obj));
                }
            });
        }

        function broadcastNeighbours(login, message, ws) {
            wss.clients.forEach(function each(client) {
                const obj : TypeChatResponse = { messageType: TypeChatMessage.GLOBAL, login, message };
                if (client !== ws && client.readyState === _ws.OPEN) {
                    client.send(JSON.stringify(obj));
                }
            });
        }

        function addIntoDb(userId, journeyId, message) {
            console.log("..add into db:", userId, journeyId, message);
        }
    }

}
