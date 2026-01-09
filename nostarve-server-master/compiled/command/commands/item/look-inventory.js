"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.permission = exports.identifiers = void 0;
exports.run = run;
const permissions_1 = require("../../../enums/permissions");
exports.identifiers = ["li", "look-inventory"];
exports.permission = permissions_1.Permissions.OWNER;
function run(player, args, isServer) {
    const id = Number(args[0]);
    const p = this.server.players[id - 1];
    if (!p)
        return [false, "Player not found"];
    player?.client?.sendJSON([8, p.inventory.serialize()]);
    return [true, "Done"];
}
