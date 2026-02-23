import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { storage } from "@shared/api/database/storage";
import { type User as SelectUser } from "@shared/api/database/schemas/schema";
import crypto from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(crypto.scrypt);

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

export async function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
  return `${derivedKey.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashedPassword, salt] = stored.split(".");
  const hashedSuppliedKey = (await scrypt(supplied, salt, 64)) as Buffer;
  return hashedSuppliedKey.toString("hex") === hashedPassword;
}

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "default_secret_for_dev",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  };

  if (app.get("env") === "production") {
    app.set("trust proxy", 1);
  }

  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const envUser = process.env.ADMIN_USERNAME || "Induktr";
        const envPass = process.env.ADMIN_PASSWORD;

        if (!envPass) {
          console.error("❌ ADMIN_PASSWORD not set in .env!");
          return done(null, false, { message: "Server configuration error" });
        }

        if (username === envUser && password === envPass) {
          // Return a 'virtual' admin user
          return done(null, { id: 1, username: envUser, password: "" });
        }
        
        return done(null, false, { message: "Unauthorized access attempt" });
      } catch (err) {
        return done(err);
      }
    }),
  );

  passport.serializeUser((user, done) => {
    done(null, user.username); // Serialize by username since it's hardcoded
  });

  passport.deserializeUser(async (username: string, done) => {
    try {
      const envUser = process.env.ADMIN_USERNAME || "Induktr";
      if (username === envUser) {
        done(null, { id: 1, username: envUser, password: "" });
      } else {
        done(null, null);
      }
    } catch (err) {
      done(err);
    }
  });

  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    res.status(200).json(req.user);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json(req.user);
  });
}
