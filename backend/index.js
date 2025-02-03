import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import helmet from "helmet";
import authRoutes from "./routes/auth.js";
import workspaceRoutes from "./routes/workspace.js";
import collectionRoutes from "./routes/collection.js";
import requestRoutes from "./routes/request.js";
import responseRoutes from "./routes/response.js";
import historyRoutes from "./routes/history.js";
import connectMongoDB from "./utils/connectMongoDB.js";
import { xss } from "express-xss-sanitizer";

//setup variables and config
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const api_version = process.env.API_VERSION || "v1";
const app = express();
app.use(express.json({ limit: "30mb", extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));
app.use(xss()); // XSS sanitizer

app.use(`/api/${api_version}/auth`, authRoutes);
app.use(`/api/${api_version}/workspace`, workspaceRoutes);
app.use(`/api/${api_version}/collection`, collectionRoutes);
app.use(`/api/${api_version}/request`, requestRoutes);
app.use(`/api/${api_version}/response`, responseRoutes);
app.use(`/api/${api_version}/history`, historyRoutes);

app.use("/assets", express.static(path.join(__dirname,'public/assets')));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    connectMongoDB();
    console.log(`Server Port ${PORT}`);
});