"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = __importDefault(require("ioredis"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const redisPort = "6379";
const redisHost = "redis.railway.internal";
const redisPassword = "XOnMEqswfIMKOFvcnJyJevaUJUZMaxGz";
// @ts-ignore
const redis = new ioredis_1.default({
    port: redisPort,
    host: redisHost,
    password: redisPassword,
});
redis.on("connect", () => {
    console.log("Redis is connected");
});
exports.default = redis;
