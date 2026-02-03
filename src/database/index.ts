import mongoose, { InferSchemaType, model } from "mongoose";
import { guildSchema } from "./schemas/guild.js";
import { memberSchema } from "./schemas/member.js";
import { env, logger } from "#settings";
import chalk from "chalk";
import { userSchema } from "./schemas/user.js";
import { blockedIPSchema } from "./schemas/blocked-ip.js";

try {
   logger.log(chalk.blue("Connecting to MongoDB..."));
   await mongoose.connect(env.MONGO_URI, { dbName: "database" });
   logger.success(chalk.green("MongoDB connected"));
} catch(err){
   logger.error(err);
   process.exit(1);
}

export const db = {
   guilds: model("guild", guildSchema, "guilds"),
   members: model("member", memberSchema, "members"),
   users: model("user", userSchema, "users"),
   blockedIPs: model("blockedIP", blockedIPSchema, "blocked_ips")
};

export type GuildSchema = InferSchemaType<typeof guildSchema>;
export type MemberSchema = InferSchemaType<typeof memberSchema>;
export * from "./schemas/user.js";