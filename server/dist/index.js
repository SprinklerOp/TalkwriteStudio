"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = 8080;
app.get("/", (req, res) => {
    res.send("Express + Typescript server11111");
});
app.listen(port, () => {
    console.log(`server is listening on port : ${port}`);
});
