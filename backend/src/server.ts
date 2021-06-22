import * as express from 'express';
import * as expressWs from 'express-ws'
import * as path from 'path'
import {WelcomeToRoom} from "./room";
import {WelcomeToPlayer} from "./player";

const staticDir = path.join(__dirname, '../../public');
console.log('Using static dir ' + staticDir);

class WelcomeToServerClass {
  public rooms: Record<string, WelcomeToRoom> = {};
  public players: Record<string, WelcomeToPlayer> = {};

  private app: expressWs.Application;

  public start(port: number) {
    this.app = expressWs(express()).app;

    this.app.use(express.static(staticDir));

    this.app.ws('/join', (ws, req) => {
      const name = req.query.name?.toString() || 'New Player';
      const player = new WelcomeToPlayer(ws, name);
      this.players[player.uuid] = player;
    });

    this.app.ws('/rejoin/:uuid', (ws, req) => {
      const player = this.players[req.params.uuid];
      if(player) {
        player.reconnect(ws);
      } else {
        const name = req.query.name?.toString() || 'New Player';
        const player = new WelcomeToPlayer(ws, name);
        this.players[player.uuid] = player;
      }
    });

    this.app.listen(port, () => {
      console.log(`Listening on port ${port}`);
    });
  }

  public createRoom(id: string) {
    const room = new WelcomeToRoom(id);
    this.rooms[id] = room;
    return room;
  }
}

export const WelcomeToServer = new WelcomeToServerClass();
