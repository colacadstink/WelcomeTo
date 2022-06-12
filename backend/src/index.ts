import {WelcomeToServer} from "./server";
import * as sourceMapSupport from 'source-map-support'
sourceMapSupport.install();

WelcomeToServer.start(1339);
