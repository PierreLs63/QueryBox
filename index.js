import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import morgan from "morgan";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import helmet from "helmet";


//setup variables and config
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname,'public/assets')));

const PORT = process.env.PORT || 3001;
app.listen(PORT,()=>console.log(`Server Port ${PORT}`));