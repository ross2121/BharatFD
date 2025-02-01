"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mains = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("../types/zod");
const translate_1 = __importDefault(require("../components/translate"));
const express_1 = require("express");
const redis_1 = require("redis");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
const redis = (0, redis_1.createClient)();
redis.connect();
router.post("/posts", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { question, answer } = req.body;
    const safeparse = zod_1.FAQ.safeParse(req.body);
    if (!safeparse) {
        return res.json({ status: 4000 }, { message: "Enter the body correctly" });
    }
    const response = yield prisma.fAQ.create({
        data: {
            question,
            answer,
        }
    });
    const langanwer = yield (0, translate_1.default)("hi", question);
    console.log(langanwer);
    const lquestion = yield (0, translate_1.default)("hi", answer);
    const BengaliQ = yield (0, translate_1.default)("bn", question);
    const BengaliA = yield (0, translate_1.default)("bn", answer);
    yield redis.lPush("hi", [langanwer, lquestion]);
    yield redis.lPush("bn", [BengaliA, BengaliQ]);
    res.status(200).json(response);
}));
router.patch("/posts/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params;
    if (!id) {
        res.json(400, { message: "No id found" });
    }
    const faq = yield prisma.fAQ.findUnique({
        where: {
            id
        }
    });
    if (!faq) {
        res.json(400, { message: "No faq found,Enter a valid id" });
    }
    const { question, answer } = req.body;
    const response = yield prisma.fAQ.update({
        where: {
            id
        }, data: {
            question,
            answer
        }
    });
    res.json({ status: 200 }, { message: "Update succesfull", response });
}));
router.get("/posts", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.query.lang;
    if (!id) {
        res.json(400, { message: "No id found" });
    }
    const faq = yield prisma.fAQ.findUnique({
        where: {
            id
        }
    });
    if (!faq) {
        res.json(400, { message: "No faq found,Enter a valid id" });
    }
    res.json({ status: 200 }, { message: "Update succesfull", faq });
}));
router.delete("/posts/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params;
    if (!id) {
        res.json(400, { message: "No id found" });
    }
    const faq = yield prisma.fAQ.findUnique({
        where: {
            id
        }
    });
    if (!faq) {
        res.json(400, { message: "No faq found,Enter a valid id" });
    }
    const deletefaq = yield prisma.fAQ.delete({
        where: {
            id
        }
    });
    res.json({ status: 200 }, { deletefaq });
}));
router.get("/posts", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const lang = req.query.lang;
    const hin = yield redis.rPop(lang);
    res.json({ hin });
}));
exports.mains = router;
