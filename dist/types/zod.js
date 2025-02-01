"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FAQ = void 0;
const zod_1 = require("zod");
exports.FAQ = zod_1.z.object({
    question: zod_1.z.string(),
    answer: zod_1.z.string(),
    language: zod_1.z.string().optional(),
});
