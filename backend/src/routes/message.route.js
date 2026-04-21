import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { getUserFromSidebar ,getMessage ,sendMessage } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users", protectRoute, getUserFromSidebar);
router.get("/:id", protectRoute, getMessage);
router.post("/send/:id", protectRoute, sendMessage); 

export default router;