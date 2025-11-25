import { Router } from "express";
import verifyAuthToken from "../middlewares/authMiddleware.js";
import { getFaq, deleteFaq, updateFaq, createFaq } from "../controllers/faqController.js";
import requireAdmin from "../middlewares/requireAdmin.js";

const router = Router();

router.get("/", getFaq);
router.post("/", verifyAuthToken, requireAdmin, createFaq);
router.delete("/", verifyAuthToken, requireAdmin, deleteFaq);
router.put("/", verifyAuthToken, requireAdmin, updateFaq);

export { router };