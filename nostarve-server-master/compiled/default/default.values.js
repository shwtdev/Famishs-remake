"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultCamera = getDefaultCamera;
exports.getDefaultPlayerCosmetics = getDefaultPlayerCosmetics;
function getDefaultCamera() {
    return {
        width: 3840,
        height: 2160
    };
}
function getDefaultPlayerCosmetics() {
    return {
        skin: 0,
        accessory: 0,
        book: 0,
        bag: 0,
        crate: 1,
        dead: 0
    };
}
