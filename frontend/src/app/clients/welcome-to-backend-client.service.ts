import {webSocket} from "rxjs/webSocket";
import {Subject} from "rxjs";
import {WelcomeToMessage} from "../../../../common/messages";
import {WelcomeToCard, WelcomeToCityPlan} from "../../../../common/cards";

export class WelcomeToBackendClient {
  public id = '';
  public players: { name: string, ready: boolean }[] = [];
  public get readyPlayers() { return this.players.filter((p) => p.ready); }
  public suitCards: WelcomeToCard[] = [];
  public valueCards: WelcomeToCard[] = [];
  public plans: WelcomeToCityPlan[] = [];
  public shuffleImminent = false;
  // region public doneTurn = false;
  private _doneTurn = false;
  public get doneTurn() {
    return this._doneTurn;
  }
  public set doneTurn(value) {
    this._doneTurn = value;
    this.send({
      method: 'doneTurnUpdate',
      doneTurn: value
    });
  }
  // endregion

  // region (Re)Join static calls
  public static join(name?: string) {
    const subj = webSocket<WelcomeToMessage>(`ws://${location.host}/join${name ? '?name=' + name : ''}`);
    return new WelcomeToBackendClient(subj);
  }

  public static rejoin(uuid: string) {
    const subj = webSocket<WelcomeToMessage>(`ws://${location.host}/rejoin/${uuid}`);
    return new WelcomeToBackendClient(subj);
  }
  // endregion

  private constructor(
    private subject: Subject<WelcomeToMessage>
  ) {
    subject.subscribe((value) => {
      if(value.method === 'error') {
        console.error(value.message);
      } else if (value.method === 'roomState') {
        this.id = value.id;
        this.players = value.players;
        this.suitCards = value.suitCards;
        this.valueCards = value.valueCards;
        this.plans = value.plans;
        this.shuffleImminent = value.shuffleImminent;
      } else if (value.method === 'doneTurnUpdate') {
        this.doneTurn = value.doneTurn;
      } else {
        console.log(`Unexpected message of type ${value.method}:`);
        console.log(value);
      }
    });
  }

  private send(message: WelcomeToMessage) {
    this.subject.next(message);
  }

  public createRoom(id: string) {
    this.send({
      method: 'createRoom',
      id
    });
  }

  public joinRoom(id: string) {
    this.send({
      method: 'joinRoom',
      id
    });
  }

  public startGame(seed?: string) {
    this.send({
      method: 'startGame',
      seed
    });
  }

  public rename(newName: string) {
    this.send({
      method: 'rename',
      newName,
    });
  }

  public doNextDeal() {
    this.send({method: 'doNextDeal'});
  }

  public claimPlan(planNumber: 1 | 2 | 3, shuffleRequested?: boolean) {
    this.send({
      method: 'claimPlan',
      planNumber,
      shuffleRequested: !!shuffleRequested
    });
  }

  public error(message: string) {
    // I don't know why you're doing this, but I'll allow it
    console.error('Sending server an error message - not sure why, but here we are');
    console.error(message);
    this.send({
      method: 'error',
      message
    });
  }
}
