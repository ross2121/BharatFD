"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const main_1 = require("./crud/main");
const client_1 = require("@prisma/client");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
// const translate=new TranslationServiceClient();
// const  translate=new Translate()
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use("/api/v1", main_1.mains);
app.listen("3000", () => {
    console.log("Listening at 3000");
});
