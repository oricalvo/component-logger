# complog

A simple logger suited for component based applications

### Who am I

complog offers a class named **Logger**. You create a Logger instance for every entity (component/service/...) inside the application.
Each Logger instance has its own prefix which allows later to filter only the relevant messages inside the browser's DevTools

### Installation

```sh
$ npm install complog
```

### Getting Started

For each component/service create a new logger instance with a unique name

```sh
import {Logger} form "complog";

const logger = Logger.create("AppComponent");

class AppComponent {
    constructor() {
        logger.log("ctor");
    }

    doSomething() {
        logger.log("doSomething");
    }
}
```

Look at the browser console. You should see something like

```sh
AppComponent> ctor
AppComponent> doSomething
```

You can use the browser filter to display only the relevant component/service messages

### More
Since multiple components of the same type may be created at runtime it is sometime important to be able
to differentiate between the instances. In that case use the following code

```sh
import {Logger} form "complog";

class AppComponent {
    private logger = Logger.create("AppComponent", Logger.AUTO_ID);

    constructor() {
        this.logger.log("ctor");
    }

    doSomething() {
        this.logger.log("doSomething");
    }
}
```

Assuming AppComponent is instantiated twice the following log is reported

```sh
AppComponent(1)> ctor
AppComponent(2)> ctor

AppComponent(1)> doSomething
```

### Samples
Inside the repository you may find the **samples** directory which contains samples for both nodejs and Angular.

### License

MIT
