import {webSocket} from "rxjs/webSocket";
import {Subject} from "rxjs";
import {WelcomeToMessage} from "../../../../common/messages";

export class WelcomeToBackendClient {
  public static join(name?: string) {
    const subj = webSocket<WelcomeToMessage>(`ws://${location.host}/join${name ? '?name=' + name : ''}`);
    return new WelcomeToBackendClient(subj);
  }

  public static rejoin(uuid: string) {
    const subj = webSocket<WelcomeToMessage>(`ws://${location.host}/rejoin/${uuid}`);
    return new WelcomeToBackendClient(subj);
  }

  private constructor(
    private subject: Subject<WelcomeToMessage>
  ) {
    subject.subscribe((value) => {
      console.log(value);
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
}
