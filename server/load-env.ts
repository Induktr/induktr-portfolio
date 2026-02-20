import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Try multiple locations for .env
const paths = [
  path.resolve(__dirname, "../.env"),
  path.resolve(process.cwd(), ".env")
];

let loaded = false;
for (const envPath of paths) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    console.log(`✅ Loaded environment from: ${envPath}`);
    loaded = true;
    break;
  }
}

if (!loaded) {
  console.log("⚠️ No .env file found in expected locations");
}

if (!process.env.DATABASE_URL) {
  console.warn("❌ DATABASE_URL is still missing after env load!");
}
