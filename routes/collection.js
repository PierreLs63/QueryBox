import express from "express";
import { createCollection } from "../controllers/collection.js";

const router = express.Router();

router.post(":workspaceId/create", createCollection);


export default router;