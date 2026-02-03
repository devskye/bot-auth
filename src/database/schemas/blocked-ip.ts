import { t } from "../utils.js";
import { HydratedDocument, Model, Schema } from "mongoose";

export interface BlockedIPSchema {
    ip: string;
    reason: string;
    blockedBy: string; // 'vpn_detection' | 'mta_server' | 'manual'
    blockedAt: Date;
    expiresAt?: Date; // null = permanente
    mtaServer?: string; // nome do servidor MTA que bloqueou
    discordUserId?: string; // ID do usuário Discord relacionado
    isActive: boolean; // se o bloqueio ainda está ativo
}

export type HydratedBlockedIPDocument = HydratedDocument<BlockedIPSchema, BlockedIPMethods>;

interface BlockedIPStatics {
    isBlocked(ip: string): Promise<boolean>;
    blockIP(ip: string, reason: string, blockedBy: string, options?: {
        expiresAt?: Date;
        mtaServer?: string;
        discordUserId?: string;
    }): Promise<HydratedBlockedIPDocument>;
    unblockIP(ip: string): Promise<boolean>;
    getActiveBlocks(): Promise<HydratedBlockedIPDocument[]>;
}

interface BlockedIPMethods {
    deactivate(): Promise<HydratedBlockedIPDocument>;
}

type BlockedIPModel = Model<BlockedIPSchema, {}, BlockedIPMethods>;

export const blockedIPSchema = new Schema<BlockedIPSchema, BlockedIPModel, BlockedIPMethods, {}, {}, BlockedIPStatics>(
    {
        ip: { type: String, required: true, unique: true },
        reason: { type: String, required: true },
        blockedBy: { type: String, required: true, enum: ['vpn_detection', 'mta_server', 'manual'] },
        blockedAt: { type: Date, default: Date.now },
        expiresAt: { type: Date, required: false },
        mtaServer: { type: String, required: false },
        discordUserId: { type: String, required: false },
        isActive: { type: Boolean, default: true }
    },
    {
        statics: {
            async isBlocked(ip: string): Promise<boolean> {
                const block = await this.findOne({ 
                    ip, 
                    isActive: true,
                    $or: [
                        { expiresAt: { $exists: false } },
                        { expiresAt: { $gt: new Date() } }
                    ]
                });
                return !!block;
            },
            
            async blockIP(ip: string, reason: string, blockedBy: string, options: {
                expiresAt?: Date;
                mtaServer?: string;
                discordUserId?: string;
            } = {}): Promise<HydratedBlockedIPDocument> {
                // Desativar bloqueios anteriores para este IP
                await this.updateMany(
                    { ip, isActive: true },
                    { isActive: false }
                );
                
                const document = await this.create({
                    ip,
                    reason,
                    blockedBy,
                    blockedAt: new Date(),
                    expiresAt: options.expiresAt,
                    mtaServer: options.mtaServer,
                    discordUserId: options.discordUserId,
                    isActive: true
                });
                
                return document as HydratedBlockedIPDocument;
            },
            
            async unblockIP(ip: string): Promise<boolean> {
                const result = await this.updateMany(
                    { ip, isActive: true },
                    { isActive: false }
                );
                return result.modifiedCount > 0;
            },
            
            async getActiveBlocks(): Promise<HydratedBlockedIPDocument[]> {
                return await this.find({
                    isActive: true,
                    $or: [
                        { expiresAt: { $exists: false } },
                        { expiresAt: { $gt: new Date() } }
                    ]
                });
            }
        },
        
        methods: {
            async deactivate(): Promise<HydratedBlockedIPDocument> {
                return await this.$set({ isActive: false }).save();
            }
        }
    }
); 