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
exports.createResetSession = exports.verifyotp = exports.generaotp = exports.logout = exports.Login = exports.Register = exports.tranporter = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const otp_generator_1 = __importDefault(require("otp-generator"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
const tokens = process.env.JWT_TOKEN || "jwttoken";
exports.tranporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    },
    port: 465,
    secure: false,
    host: 'smtp.gmail.com'
});
const Register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, name } = req.body;
        if (!email || !password || !name) {
            throw new Error("Please provide name, email, and password");
        }
        const existingUser = yield prisma.admin.findUnique({
            where: {
                email: email
            }
        });
        if (existingUser) {
            return res.status(409).send({
                message: "Email is already in use"
            });
        }
        req.app.locals.OTP = otp_generator_1.default.generate(6, {
            upperCaseAlphabets: false,
            specialChars: false,
            lowerCaseAlphabets: false,
            digits: true
        });
        yield (0, exports.generaotp)(req, res, next);
        res.status(200).send({ message: "OTP sent. Please verify to complete registration." });
    }
    catch (error) {
        next(error);
    }
});
exports.Register = Register;
const Login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { password, email } = req.body;
    if (!password || !email) {
        throw new Error("Please provide name, email, and password");
    }
    try {
        const user = yield prisma.admin.findUnique({
            where: {
                email: email
            }
        });
        if (!user) {
            throw new Error("User not found");
        }
        const validPassword = bcrypt_1.default.compareSync(password, user.password);
        if (!validPassword) {
            throw new Error("Wrong password");
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id }, tokens, { expiresIn: "365d" });
        res.status(200).json({ token, user });
    }
    catch (err) {
        next(err);
    }
});
exports.Login = Login;
const logout = (req, res, next) => {
    res.clearCookie("acess_token").json({ message: "Logged out" });
};
exports.logout = logout;
const generaotp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    req.app.locals.OTP = otp_generator_1.default.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false, digits: true });
    console.log(req.app.locals.OTP);
    const { name, email, reason } = req.body;
    console.log(email);
    const verifyotp = {
        from: process.env.EMAIL_USERNAME,
        to: email,
        subject: 'Account verification OTP',
        html: ` <div style="font-family: Poppins, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border: 1px solid #ccc; border-radius: 5px;">
    <h1 style="font-size: 22px; font-weight: 500; color: #854CE6; text-align: center; margin-bottom: 30px;">Verify Your ERP System Admin Account</h1>
    <div style="background-color: #FFF; border: 1px solid #e5e5e5; border-radius: 5px; box-shadow: 0px 3px 6px rgba(0,0,0,0.05);">
        <div style="background-color: #854CE6; border-top-left-radius: 5px; border-top-right-radius: 5px; padding: 20px 0;">
            <h2 style="font-size: 28px; font-weight: 500; color: #FFF; text-align: center; margin-bottom: 10px;">Admin Verification Code</h2>
            <h1 style="font-size: 32px; font-weight: 500; color: #FFF; text-align: center; margin-bottom: 20px;">${req.app.locals.OTP}</h1>
        </div>
        <div style="padding: 30px;">
            <p style="font-size: 14px; color: #666; margin-bottom: 20px;">Dear Admin ${name},</p>
            <p style="font-size: 14px; color: #666; margin-bottom: 20px;">Thank you for registering your ERP System Admin account. To activate your admin account, please enter the following verification code:</p>
            <p style="font-size: 20px; font-weight: 500; color: #666; text-align: center; margin-bottom: 30px; color: #854CE6;">${req.app.locals.OTP}</p>
            <p style="font-size: 12px; color: #666; margin-bottom: 20px;">Please enter this code in the ERP system to complete your admin account activation.</p>
            <p style="font-size: 12px; color: #666; margin-bottom: 20px;">If you did not create an ERP system admin account, please disregard this email.</p>
        </div>
    </div>
    <br>
    <p style="font-size: 16px; color: #666; margin-bottom: 20px; text-align: center;">Best regards,<br>The ERP System Team</p>
</div>
`
    };
    const resetpasswordotp = {
        from: process.env.EMAIL_USERNAME,
        to: email,
        subject: "Realtor Reset password verification",
        html: `<div style="font-family: Poppins, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border: 1px solid #ccc; border-radius: 5px;">
                <h1 style="font-size: 22px; font-weight: 500; color: #854CE6; text-align: center; margin-bottom: 30px;">Reset Your Realtor Account Password</h1>
                <div style="background-color: #FFF; border: 1px solid #e5e5e5; border-radius: 5px; box-shadow: 0px 3px 6px rgba(0,0,0,0.05);">
                    <div style="background-color: #854CE6; border-top-left-radius: 5px; border-top-right-radius: 5px; padding: 20px 0;">
                        <h2 style="font-size: 28px; font-weight: 500; color: #FFF; text-align: center; margin-bottom: 10px;">Verification Code</h2>
                        <h1 style="font-size: 32px; font-weight: 500; color: #FFF; text-align: center; margin-bottom: 20px;">${req.app.locals.OTP}</h1>
                    </div>
                    <div style="padding: 30px;">
                        <p style="font-size: 14px; color: #666; margin-bottom: 20px;">Dear ${name},</p>
                        <p style="font-size: 14px; color: #666; margin-bottom: 20px;">To reset your Realtor account password, please enter the following verification code:</p>
                        <p style="font-size: 20px; font-weight: 500; color: #666; text-align: center; margin-bottom: 30px; color: #854CE6;">${req.app.locals.OTP}</p>
                        <p style="font-size: 12px; color: #666; margin-bottom: 20px;">Please enter this code in the Realtor app to reset your password.</p>
                        <p style="font-size: 12px; color: #666; margin-bottom: 20px;">If you did not request a password reset, please disregard this email.</p>
                    </div>
                </div>
                <br>
                <p style="font-size: 16px; color: #666; margin-bottom: 20px; text-align: center;">Best regards,<br>The PODSTREAM Team</p>
            </div>`
    };
    if (reason == "FORGOTPASSWORD") {
        exports.tranporter.sendMail(resetpasswordotp, (err) => {
            if (err) {
                next(err);
            }
            else {
                return res.status(200).send({ message: "OTP sent" });
            }
        });
    }
    else {
        try {
            exports.tranporter.sendMail(verifyotp, (err) => {
                if (err) {
                    res.send(err);
                }
                else {
                    return res.status(200).send({ message: "OTP Sent" });
                }
            });
        }
        catch (error) {
            console.log(error);
        }
    }
});
exports.generaotp = generaotp;
const verifyotp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { code, name, email, password } = req.body;
        console.log("Received OTP:", code);
        console.log("User data:", { name, email, password });
        if (parseInt(code) === parseInt(req.app.locals.OTP)) {
            req.app.locals.OTP = null;
            req.app.locals.resetSession = true;
            const salt = bcrypt_1.default.genSaltSync(10);
            const hashedPassword = bcrypt_1.default.hashSync(password, salt);
            const newUser = yield prisma.admin.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                },
            });
            const token = jsonwebtoken_1.default.sign({ id: newUser.id, role: "admin" }, tokens, { expiresIn: "365d" });
            res.status(200).json({ token, user: newUser });
        }
        else {
            throw new Error("Wrong OTP");
        }
    }
    catch (error) {
        console.error(error);
    }
});
exports.verifyotp = verifyotp;
const createResetSession = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.app.locals.resetSession) {
        req.app.locals.resetSession = false;
        return res.status(200).send({ message: "Access granted" });
    }
    return res.status(400).send({ message: "Session expired" });
});
exports.createResetSession = createResetSession;
