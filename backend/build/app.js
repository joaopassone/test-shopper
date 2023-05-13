"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
class App {
    constructor() {
        this.app = express();
        this.app.use(express.json());
    }
    start(PORT) {
        this.app.listen(PORT, () => console.log(`Rodando na porta ${PORT}`));
    }
}
exports.default = App;
//# sourceMappingURL=app.js.map