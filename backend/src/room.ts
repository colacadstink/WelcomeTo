import { v4 as uuidv4 } from 'uuid';
import * as seedrandom from "seedrandom";
import {WelcomeToCard, WelcomeToCityPlan} from "../../common/cards";
import {generateNewGame, shuffleList} from "./shuffler";
import {WelcomeToPlayer} from "./player";
import {RoomState} from "../../common/messages";

export class WelcomeToRoom {
  public players: WelcomeToPlayer[] = [];
  public valueCards: WelcomeToCard[] = [];
  public suitCards: WelcomeToCard[] = [];
  public plans: WelcomeToCityPlan[] = [];
  public shuffleRequested = false;

  private pristineDeck: WelcomeToCard[] = [];
  private deck: WelcomeToCard[] = [];

  constructor(
    public id: string,
  ) {}

  public update(...targets: WelcomeToPlayer[]) {
    if(targets.length === 0) {
      targets = this.players;
    }

    const players = this.players.map((p) => {
      return {
        name: p.name,
        ready: p.ready,
      }
    });
    const state: Omit<RoomState, 'me'> = {
      method: 'roomState',
      id: this.id,
      players: players,
      valueCards: this.valueCards,
      suitCards: this.suitCards,
      plans: this.plans,
      shuffleImminent: this.shuffleRequested || this.deck.length < 3,
    };
    for(const player of targets) {
      player.send({
        ...state,
        me: {
          name: player.name,
          uuid: player.uuid,
          ready: player.ready,
        },
      });
    }
  }

  public startGame(seed?: string) {
    const gameInfo = generateNewGame(seed);
    this.pristineDeck = gameInfo.deck;
    this.plans = gameInfo.plans;
    this.flipDeal();
  }

  public flipDeal() {
    if(this.shuffleRequested || this.deck.length < 3) {
      this.deck = shuffleList(this.pristineDeck, seedrandom(uuidv4()));
      this.valueCards = [];
      this.suitCards = [];
    }

    if(this.valueCards.length === 0) {
      this.valueCards = this.deck.splice(0, 3);
    }
    this.suitCards = this.valueCards;
    this.valueCards = this.deck.splice(0, 3);

    for(const player of this.players) {
      player.ready = false;
      player.send({
        method: 'readyUpdate',
        ready: false
      });
    }

    this.update();
  }
}
