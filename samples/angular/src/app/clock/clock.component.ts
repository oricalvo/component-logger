import { Component, OnInit } from '@angular/core';
import {Logger} from "complog";
import {appLogger} from "../logger";

@Component({
  selector: 'app-clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.css']
})
export class ClockComponent implements OnInit {
  logger = appLogger.create("ClockComponent").create("AUTO_ID");

  constructor() {
    this.logger("ctor").log();
  }

  ngOnInit() {
  }

  doSomething() {
    this.logger("doSomething").log();

    // this.logger.profile("doSomething", ()=> {
    //   return delay(2500);
    // });
  }
}

function delay(ms) {
  return new Promise(function(resolve, reject) {
    setTimeout(function () {
      resolve();
    }, ms);
  });
}

