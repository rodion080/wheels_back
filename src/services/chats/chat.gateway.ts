import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from "@nestjs/websockets";
// import { Server } from "socket.io";
import { Server } from "ws";

@WebSocketGateway({
    cors: { origin: "*" }
})
export class ChatGateway {
  @WebSocketServer()
      server: Server;

  @SubscribeMessage("message")
  handleMessage(@MessageBody() message: string): void {
      console.log("message", message);
  }

}
