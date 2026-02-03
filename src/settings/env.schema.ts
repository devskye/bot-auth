import { z } from "zod";

export const envSchema = z.object({
    BOT_TOKEN: z.string("Discord Bot Token is required").min(1),
    WEBHOOK_LOGS_URL: z.string().url().optional(),
    MONGO_URI: z.string("MongoDb URI is required").min(1),
    SERVER_PORT: z.coerce.number().min(1).optional(),
    SERVER_BASE_URL: z.string().url(),
    CLIENT_ID: z.string(),
    CLIENT_SECRET: z.string(),


});
