"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const canvas_1 = require("canvas");
const discord_js_1 = require("discord.js");
const server_1 = require("../server");
const sprite_manager_1 = __importDefault(require("../sprite/sprite.manager"));
const path = __importStar(require("path"));
(0, canvas_1.registerFont)(path.join(__dirname, "../../BalooPaaji2-ExtraBold.ttf"), {
    family: "Baloo Paaji 2"
});
sprite_manager_1.default.init();
class DiscordBot {
    startedAt;
    server;
    client;
    data;
    constructor(server) {
        this.server = server;
        this.client = new discord_js_1.Client({
            intents: [
                discord_js_1.GatewayIntentBits.Guilds,
                discord_js_1.GatewayIntentBits.GuildMessages,
                discord_js_1.GatewayIntentBits.MessageContent
            ]
        });
        this.startedAt = Date.now() - 3_600_000 * 2;
        this.data = new Map();
        this.start();
    }
    hasRole(name, member) {
        return member.roles.cache.some(role => role.name === name);
    }
    start() {
        this.client.on("messageCreate", async (message) => {
            try {
                if (message.author.bot)
                    return;
                const isAdmin = message.member.user.id === "563325554170789898";
                const words = message.content.trim().split(" ");
                if (message.content.startsWith(server_1.discordConfig.prefix)) {
                    const command = words[0].substring(server_1.discordConfig.prefix.length);
                    const args = words.slice(1);
                    switch (command) {
                        /**
                         * !exec command
                         */
                        case "exec":
                            if (!isAdmin)
                                break;
                            this.server.commandSystem.handleServerCommand(args.join(" "));
                            await message.channel.send("Executed command");
                            break;
                        case "playerCount":
                            await message.channel.send(this.server.alivePlayers.length.toString());
                            break;
                        case "tps":
                            await message.channel.send(this.server.ticker.tps.toFixed(1));
                            break;
                        case "kit":
                            {
                                const kit = args[0];
                                const id = Number(args[1]);
                                if (isNaN(id) || !kit) {
                                    break;
                                }
                                const player = this.server.players[id - 1];
                                if (!player || !player.alive)
                                    break;
                                switch (kit) {
                                    case "booster":
                                        if (!this.hasRole("Server Booster", message.member) && !isAdmin) {
                                            await message.channel.send(`You don't have permission to use this command`);
                                            return;
                                        }
                                        if (!this.data.has(message.member.id))
                                            this.data.set(message.member.id, this.startedAt);
                                        if (Date.now() - this.data.get(message.member.id) < 3_600_000 * 3) {
                                            await message.channel.send(`You can't use booster kit until <t:${Math.round((this.data.get(message.member.id) + 3_600_000 * 3) / 1000)}>`);
                                            return;
                                        }
                                        this.data.set(message.member.id, Date.now());
                                        this.server.kitSystem.discordGainKit(player, "booster");
                                        await message.channel.send(`Player with name ${player.nickname} gain booster kit`);
                                        break;
                                }
                            }
                            break;
                    }
                }
            }
            catch (e) {
                console.log(e);
            }
        });
        this.client.once("ready", () => {
            this.server.logger.log("[Discord] Ready!");
        });
        this.client.login(this.server.settings.production ? server_1.discordConfig.prodToken : server_1.discordConfig.devToken);
    }
}
exports.default = DiscordBot;
