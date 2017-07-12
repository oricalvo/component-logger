import {Logger} from "complog";

let logger = Logger.create("main");
logger.log("Hello");

logger = Logger.create("myApp", "main");
logger.error("Hello");

logger = Logger.create("main", Logger.AUTO_ID);
logger.warn("Hello1");

logger = Logger.create("main", Logger.AUTO_ID);
logger.warn("Hello2");

logger = Logger.create("main", 999);
logger.warn("Hello2");

logger = Logger.create("myApp", "main", "AUTO_ID");
logger.warn("Hello1");

logger = Logger.create("myApp", "main", "AUTO_ID");
logger.warn("Hello2");

//logger.warn("Hello");
