import express from "express";

import * as authController from "../controllers/authController";
import * as userController from "../controllers/userController";

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

router.use(authController.verifyJwt);

router.get("/bookmarks", userController.getBookmarks);
router.post("/bookmarks/:showId", userController.addBookmark);
router.delete("/bookmarks/:showId", userController.removeBookmark);

export default router;
