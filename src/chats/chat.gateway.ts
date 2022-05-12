import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from "@nestjs/websockets";
// import { Server } from "socket.io";
import { Server } from "ws";

// @WebSocketGateway(80, {namespace:'chat'})
@WebSocketGateway({
  cors: { origin: "*" }
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  // handleMessage(client, data):void{
  @SubscribeMessage("message")
  handleMessage(@MessageBody() message: string): void {
    console.log("message", message);
    // this.server.on("message", message);
  }

}