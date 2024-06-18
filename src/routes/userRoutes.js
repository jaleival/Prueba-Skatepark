import express from "express";
import {
  homePage,
  register,
  addskaterController,
  getSkaterController,
  loginController,
  logController,
  profileUpdate,
  updateProfile,
  deleteAccount,
  updateStatus,
  updateSkaterStatus,
  rutaGenerica,
} from "../controllers/userControllers.js";
const router = express.Router();

router.get("/", getSkaterController);
router.get("/registro", register);
router.post("/skaters", addskaterController);
router.get("/login", loginController);
router.get("/skaters", getSkaterController);
router.post("/login", logController);
router.get("/perfil", profileUpdate);
router.delete("/skaters/:id", deleteAccount);
router.put("/perfil/:id", updateProfile);
router.get("/admin", updateStatus);
router.put("/skaters/status/:id", updateSkaterStatus);

router.get("*", rutaGenerica);

export default router;