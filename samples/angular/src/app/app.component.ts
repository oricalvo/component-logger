import { Component } from '@angular/core';
import {Logger} from "complog";
import {appLogger} from "./logger";

const logger = appLogger.create("AppComponent");

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor() {
    logger("ctor").log();
  }
}
