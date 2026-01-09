"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.permission = exports.identifiers = void 0;
exports.run = run;
const permissions_1 = require("../../../enums/permissions");
exports.identifiers = ["da", "disable-attack"];
exports.permission = permissions_1.Permissions.OWNER;
function run(player, args, isServer) {
    this.server.config.disable_attack = this.server.config.disable_attack === 1 ? 0 : 1;
    return [true, "Attack is now " + (this.server.config.disable_attack === 1 ? "disabled" : "enabled")];
}
