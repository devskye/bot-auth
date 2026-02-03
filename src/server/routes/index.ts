import type { Client } from "discord.js";
import type { Express } from "express";
import { homeRoutes } from "./home.js";
import { authRoutes } from "./auth.js";
import { mtaRoutes } from "./mta.js";

export function registerRoutes(app: Express, client: Client<true>){
    homeRoutes(app, client);
    authRoutes(app, client);
    mtaRoutes(app);
}