import express from "express";
import * as authController from "../controllers/authController";

const router = express.Router();

router.get("/refresh", authController.refresh);
router.get(
  "/verify",
  authController.verifyJwt,
  authController.checkSessionStatus
);
router.post("/google/callback", authController.signInWithGoogle);

export default router;
