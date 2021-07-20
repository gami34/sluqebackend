import express from "express";
import {
  categoryCreate,
  getListCategories,
  getCategoryBySlug,
  categoryUpdate,
  categoryDelete,
} from "../controllers/categoryController.js";
import { isAdmin, isAuthenticated } from "../middlewares/auth.js";

const categoryRouter = express.Router();

categoryRouter.post("/category", isAuthenticated, isAdmin, categoryCreate);
categoryRouter.get("/categories", getListCategories);
categoryRouter.get("/category/:slug", getCategoryBySlug);
categoryRouter.put("/category/:slug", isAuthenticated, isAdmin, categoryUpdate);
categoryRouter.delete(
  "/category/:slug",
  isAuthenticated,
  isAdmin,
  categoryDelete
);

export default categoryRouter;
