import { Component } from '@angular/core';
import {Logger} from "complog";

const logger = Logger.create("AppComponent");

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor() {
    logger.log("ctor");
  }
}
