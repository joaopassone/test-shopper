"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const product_controller_1 = require("./controllers/product.controller");
class App {
    constructor() {
        this.app = express();
        this.app.use(express.json());
        this.productController = new product_controller_1.default();
        this.app.get('/', this.productController.getAll);
    }
    start(PORT) {
        this.app.listen(PORT, () => console.log(`Rodando na porta ${PORT}`));
    }
}
exports.default = App;
//# sourceMappingURL=app.js.map