import { createEvent } from "#base";
import express from "express";
import cors from "cors";
import { env, logger } from "#settings";
import ck from "chalk";
import { registerRoutes } from "./routes/index.js";

createEvent({
    name: "Start Express Server",
    event: "ready", once: true,
    async run(client) {
        const app = express();
        
      
        app.set('trust proxy', true);
        
        app.use(express.json(), cors());
        app.use(express.static('public'));

        registerRoutes(app, client);

        const port = env.SERVER_PORT ?? 10004;
       
        app.listen(port, "0.0.0.0", () => {
            logger.log(ck.green(`● ${ck.underline("Express")} server listening on port ${port}`));
        });
    },
});