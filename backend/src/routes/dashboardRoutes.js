import { Router } from "express";
import { dashboard } from "../controllers/dashboardController.js";
import { requireAuth } from "../middleware/auth.js";

export const dashboardRoutes = Router();

dashboardRoutes.get("/dashboard/:user_id", requireAuth, dashboard);
dashboardRoutes.get("/progress", requireAuth, (req, res, next) => {
  req.params.user_id = req.auth.sub;
  dashboard(req, res, next);
});
