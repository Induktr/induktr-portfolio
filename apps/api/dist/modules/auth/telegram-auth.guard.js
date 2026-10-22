var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var TelegramAuthGuard_1;
import { Injectable, Logger, UnauthorizedException, } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { createHmac } from "crypto";
let TelegramAuthGuard = TelegramAuthGuard_1 = class TelegramAuthGuard {
    config;
    logger = new Logger(TelegramAuthGuard_1.name);
    botToken;
    constructor(config) {
        this.config = config;
        this.botToken = this.config.get("TELEGRAM_BOT_TOKEN");
    }
    canActivate(context) {
        const gqlCtx = GqlExecutionContext.create(context);
        const req = gqlCtx.getContext().req || context.switchToHttp().getRequest();
        const authHeader = req.headers.authorization || req.headers["x-telegram-init-data"];
        if (!authHeader) {
            throw new UnauthorizedException("Missing Telegram initData header");
        }
        const initDataStr = typeof authHeader === "string" && authHeader.startsWith("Bearer ")
            ? authHeader.slice(7)
            : String(authHeader);
        const isValid = this.verifyTelegramInitData(initDataStr);
        if (!isValid) {
            throw new UnauthorizedException("Invalid Telegram cryptographic signature");
        }
        // Attach parsed user to request
        const params = new URLSearchParams(initDataStr);
        const userStr = params.get("user");
        if (userStr) {
            try {
                req.user = JSON.parse(userStr);
            }
            catch {
                // Fallback
            }
        }
        return true;
    }
    /**
     * Cryptographic verification using HMAC-SHA256 with "WebAppData" secret key
     */
    verifyTelegramInitData(initData) {
        if (!this.botToken) {
            this.logger.warn("TELEGRAM_BOT_TOKEN not configured — permitting bypass in non-production.");
            return process.env.NODE_ENV !== "production";
        }
        try {
            const params = new URLSearchParams(initData);
            const hash = params.get("hash");
            if (!hash)
                return false;
            params.delete("hash");
            // Sort alphabetically
            const dataCheckString = Array.from(params.entries())
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([k, v]) => `${k}=${v}`)
                .join("\n");
            const secretKey = createHmac("sha256", "WebAppData")
                .update(this.botToken)
                .digest();
            const computedHash = createHmac("sha256", secretKey)
                .update(dataCheckString)
                .digest("hex");
            return computedHash === hash;
        }
        catch (e) {
            this.logger.error("Cryptographic signature verification failed", e);
            return false;
        }
    }
};
TelegramAuthGuard = TelegramAuthGuard_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Function])
], TelegramAuthGuard);
export { TelegramAuthGuard };
