"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = require("nodemailer");
const transporter = (0, nodemailer_1.createTransport)({
    port: 465,
    host: "smtp.gmail.com",
    auth: {
        user: "dattaramparab181@gmail.com",
        pass: "yuwx vzra qtvy rosf",
    },
    secure: true,
});
exports.default = transporter;
