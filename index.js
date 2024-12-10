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
import historyRoutes from "./routes/history.js";
import connectMongoDB from "./utils/connectMongoDB.js";

//setup variables and config
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname,'public/assets')));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/workspace', workspaceRoutes);
app.use('/api/v1/collection', collectionRoutes);
app.use('/api/v1/request', requestRoutes);
app.use('/api/v1/history', historyRoutes);



const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    connectMongoDB();
    console.log(`Server Port ${PORT}`);
});