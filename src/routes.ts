import { Router } from "express";
import multer from 'multer';

import { ensureAutheticated } from "./middleware/ensureAuthenticated";
import uploadConfig from "./config/multer"

import AuthUserController from "./controllers/AuthUserController";
import ChildController from "./controllers/ChildController";
import FoodPlanController from "./controllers/FoodPlanController";
import BreastfeedingController from "./controllers/BreastfeedingController";
import MilestoneController from "./controllers/MilestoneController";
import ApoloController from "./controllers/ApoloController";

const router = Router();
const upload = multer(uploadConfig)

router.post("/login", AuthUserController.create)
router.post("/auth", AuthUserController.auth)

router.use(ensureAutheticated)

router.get("/user", AuthUserController.user)
router.put("/update", AuthUserController.update)
router.post("/create-child", ChildController.create)
router.get("/getchildren", ChildController.getChildren)
router.post("/createfoodplans", FoodPlanController.create)
router.get("/getfoodplans", FoodPlanController.getFoodPan)
router.post("/breastfeeding", BreastfeedingController.create)
router.get("/breastfeeding", BreastfeedingController.getFoodPan)
router.get("/milestones", MilestoneController.milestone)
router.post("/apoloapi", ApoloController.apolo)
router.post("/apoloapi_access_token", ApoloController.token)

export { router };