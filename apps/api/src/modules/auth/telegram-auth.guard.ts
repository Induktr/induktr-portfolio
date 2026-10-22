import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import type { ConfigService } from "@nestjs/config";
import { GqlExecutionContext } from "@nestjs/graphql";
import { createHmac } from "crypto";

@Injectable()
export class TelegramAuthGuard implements CanActivate {
  private readonly logger = new Logger(TelegramAuthGuard.name);
  private readonly botToken: string | undefined;

  constructor(private readonly config: ConfigService) {
    this.botToken = this.config.get<string>("TELEGRAM_BOT_TOKEN");
  }

  canActivate(context: ExecutionContext): boolean {
    const gqlCtx = GqlExecutionContext.create(context);
    const req = gqlCtx.getContext().req || context.switchToHttp().getRequest();

    const authHeader =
      req.headers.authorization || req.headers["x-telegram-init-data"];
    if (!authHeader) {
      throw new UnauthorizedException("Missing Telegram initData header");
    }

    const initDataStr =
      typeof authHeader === "string" && authHeader.startsWith("Bearer ")
        ? authHeader.slice(7)
        : String(authHeader);

    const isValid = this.verifyTelegramInitData(initDataStr);
    if (!isValid) {
      throw new UnauthorizedException(
        "Invalid Telegram cryptographic signature",
      );
    }

    // Attach parsed user to request
    const params = new URLSearchParams(initDataStr);
    const userStr = params.get("user");
    if (userStr) {
      try {
        req.user = JSON.parse(userStr);
      } catch {
        // Fallback
      }
    }

    return true;
  }

  /**
   * Cryptographic verification using HMAC-SHA256 with "WebAppData" secret key
   */
  private verifyTelegramInitData(initData: string): boolean {
    if (!this.botToken) {
      this.logger.warn(
        "TELEGRAM_BOT_TOKEN not configured — permitting bypass in non-production.",
      );
      return process.env.NODE_ENV !== "production";
    }

    try {
      const params = new URLSearchParams(initData);
      const hash = params.get("hash");
      if (!hash) return false;

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
    } catch (e) {
      this.logger.error("Cryptographic signature verification failed", e);
      return false;
    }
  }
}
