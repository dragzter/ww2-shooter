"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Memory {
    constructor() {
        this.id = "gameState";
    }
    read() {
        if (localStorage.getItem(this.id)) {
            const state = localStorage.getItem(this.id);
            return JSON.parse(state);
        }
        return null;
    }
    save(state) {
        const memory = this.read();
        let cache = {};
        if (memory) {
            cache = Object.assign(memory, state);
        }
        else {
            cache = state;
        }
        localStorage.setItem(this.id, JSON.stringify(cache));
    }
}
exports.default = Memory;
//# sourceMappingURL=memory.js.map