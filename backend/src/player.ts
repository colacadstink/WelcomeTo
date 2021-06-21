import { v4 as uuidv4 } from 'uuid';
import * as WebSocket from 'ws';
import {ErrorMessage, WelcomeToMessage} from "../../common/messages";
import {WelcomeToRoom} from "./room";
import {WelcomeToServer} from "./server";

export class WelcomeToPlayer {
  public uuid: string;
  public userConnected = true;
  public doneTurn = false;
  public room: WelcomeToRoom = null;

  constructor(
    public ws: WebSocket,
    public name: string
  ) {
    this.uuid = uuidv4();
    this.setupWebSocket();
  }

  public reconnect(ws: WebSocket) {
    if(this.ws.readyState === WebSocket.OPEN) {
      this.ws.close(1001, JSON.stringify({method: "error", message: "Another user is connecting to this UUID"} as ErrorMessage));
    }
    this.ws = ws;
    this.userConnected = true;
    this.setupWebSocket();
  }

  public send(message: WelcomeToMessage) {
    if(this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  public sendError(message: string) {
    this.send({method: 'error', message} as ErrorMessage);
  }

  private setupWebSocket() {
    this.ws.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString()) as WelcomeToMessage;
        if (!message.method) {
          this.sendError('No method provided');
          return;
        }

        if (message.method === 'createRoom') {
          this.room = WelcomeToServer.createRoom(message.id);
          this.room.players.push(this);
          this.room.update();

        } else if (message.method === 'joinRoom') {
          const room = WelcomeToServer.rooms[message.id];
          if (!room) {
            this.sendError(`No room exists with that ID - try creating it?`);
            return;
          }
          this.room = room;
          if (this.room.players.indexOf(this) === -1) {
            this.room.players.push(this);
          }
          this.room.update();

        } else if (message.method === 'startGame') {
          if(!this.room) {
            this.sendError("You're not in a room, I can't do that!");
            return;
          }
          this.room.startGame(message.seed);

        } else if (message.method === 'doneTurnUpdate') {
          this.doneTurn = message.doneTurn;
          this.room?.update();

        } else if (message.method === 'rename') {
          this.name = message.newName;
          this.room?.update();

        } else if (message.method === 'doNextDeal') {
          this.room?.flipDeal();

        } else if (message.method === 'roomState') {
          this.sendError('What are you telling me the room state for?');

        } else if (message.method === 'claimPlan') {
          if(!this.room) {
            this.sendError("You're not in a room, I can't do that!");
            return;
          }
          const plan = this.room.plans.find((p) => p.planNumber === message.planNumber);
          plan.claimed = true;
          this.room.shuffleRequested = this.room.shuffleRequested || message.shuffleRequested;
          this.room.update();

        } else {
          // This can only be an error message at this point, so log it.
          // If there's an error on this line, it's probably because a new message type was introduced, but isn't
          // being dealt with above!
          console.error(message.message);
        }
      } catch (e) {
        console.error(e);
        this.sendError(JSON.stringify(e));
      }
    });
  }
}
