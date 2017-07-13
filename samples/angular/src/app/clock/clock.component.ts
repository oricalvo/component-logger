import { Component, OnInit } from '@angular/core';
import {Logger} from "complog";

@Component({
  selector: 'app-clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.css']
})
export class ClockComponent implements OnInit {
  logger = Logger.create("ClockComponent", Logger.AUTO_ID);

  constructor() {
    this.logger.log("ctor")();
  }

  ngOnInit() {
  }

  doSomething() {
    this.logger.log("doSomething")();

    this.logger.profile("doSomething", ()=> {
      return delay(2500);
    });
  }
}

function delay(ms) {
  return new Promise(function(resolve, reject) {
    setTimeout(function () {
      resolve();
    }, ms);
  });
}

