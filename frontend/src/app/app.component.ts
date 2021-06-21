import {Component} from '@angular/core';
import {WelcomeToBackendClient} from "./clients/welcome-to-backend-client.service";

@Component({
  selector: 'welcome-to-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.less']
})
export class AppComponent {
  public client: WelcomeToBackendClient;
  public roomID: string = '';

  constructor() {
    this.client = WelcomeToBackendClient.join('Ben');
  }

  public getOptions() {
    const options: string[] = [];
    const cardCount = this.client.suitCards.length;
    for(let i=0; i<cardCount; i++) {
      if(this.client.suitCards[i].suit === 'temp') {
        options.push(`${this.client.valueCards[i].value} of ${this.client.suitCards[i].suit} (effectively ${this.client.valueCards[i].value - 2}-${this.client.valueCards[i].value + 2})`);
      } else {
        options.push(`${this.client.valueCards[i].value} of ${this.client.suitCards[i].suit}`);
      }
    }
    return options;
  }

  public getNextTurnSuits() {
    return this.client.valueCards.map((c) => c.suit);
  }
}
