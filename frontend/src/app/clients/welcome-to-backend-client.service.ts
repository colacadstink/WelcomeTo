import {webSocket} from "rxjs/webSocket";
import {Subject} from "rxjs";
import {WelcomeToMessage} from "../../../../common/messages";
import {WelcomeToCard, WelcomeToCityPlan} from "../../../../common/cards";
import {debounceTime} from 'rxjs/operators';

const LOCAL_STORAGE_UUID_KEY = 'WelcomeToBackendClient_UUID';

export class WelcomeToBackendClient {
  public id = '';
  public me = {
    name: 'New Player',
    uuid: '',
    ready: false
  };
  public players: { name: string, ready: boolean }[] = [];
  public get readyPlayers() { return this.players.filter((p) => p.ready); }
  public suitCards: WelcomeToCard[] = [];
  public valueCards: WelcomeToCard[] = [];
  public plans: WelcomeToCityPlan[] = [];
  public shuffleImminent = false;
  // region public ready = false;
  public get ready() {
    return this.me.ready;
  }
  public set ready(value) {
    this.me.ready = value;
    this.send({
      method: 'readyUpdate',
      ready: value
    });
  }
  // endregion
  // region public name: string;
  private nameChangeDebouncer = new Subject<string>();
  public get name() {
    return this.me.name;
  }
  public set name(value) {
    this.me.name = value;
    this.nameChangeDebouncer.next(value);
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

  public static connect() {
    const uuid = localStorage.getItem(LOCAL_STORAGE_UUID_KEY);
    if(uuid) {
      console.log('Reconnecting with UUID ' + uuid);
      return this.rejoin(uuid);
    } else {
      console.log('Joining as new player');
      return this.join();
    }
  }

  private constructor(
    private subject: Subject<WelcomeToMessage>
  ) {
    subject.subscribe((value) => {
      if(value.method === 'error') {
        console.error(value.message);
      } else if (value.method === 'roomState') {
        this.id = value.id;
        this.me = value.me;
        this.players = value.players;
        this.suitCards = value.suitCards;
        this.valueCards = value.valueCards;
        this.plans = value.plans;
        this.shuffleImminent = value.shuffleImminent;
        localStorage.setItem(LOCAL_STORAGE_UUID_KEY, this.me.uuid);
      } else if (value.method === 'readyUpdate') {
        this.ready = value.ready;
      } else {
        console.log(`Unexpected message of type ${value.method}:`);
        console.log(value);
      }
    });

    this.nameChangeDebouncer
      .pipe(debounceTime(500))
      .subscribe((newName) => {
        this.send({
          method: 'rename',
          newName
        });
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
