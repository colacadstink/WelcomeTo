import {Component, OnInit} from '@angular/core';
import {WelcomeToBackendClient} from "./clients/welcome-to-backend-client.service";

@Component({
  selector: 'welcome-to-root',
  template: `
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class AppComponent implements OnInit {
  public ngOnInit() {
    const client = WelcomeToBackendClient.join('Ben');
    client.createRoom('12345');
  }
}
