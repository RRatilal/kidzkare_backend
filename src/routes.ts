import { Router } from "express";

import { ensureAuthenticated } from "./middleware/ensureAuthenticated";
import uploadConfig from "./config/multer"

import AuthUserController from "./controllers/AuthUserController";
import ChildController from "./controllers/ChildController";
import FoodPlanController from "./controllers/FoodPlanController";
import BreastfeedingController from "./controllers/BreastfeedingController";
import MilestoneController from "./controllers/MilestoneController";
import ApoloController from "./controllers/ApoloController";
import RefreshTokenController from "./controllers/RefreshTokenController";
// import SyncController from "./controllers/SyncController";

const router = Router();

router.post("/login", AuthUserController.create)
router.post("/auth", AuthUserController.auth)
router.post("/refresh-token", RefreshTokenController.refreshToken)

router.use(ensureAuthenticated)

// router.get("/sync", SyncController.pull)
// router.post("/sync", SyncController.push)

router.get("/user", AuthUserController.user)
router.put("/update", AuthUserController.update)

router.post("/children", ChildController.create)
router.get("/children", ChildController.getChildren)

router.post("/createfoodplans", FoodPlanController.create)
router.get("/getfoodplans", FoodPlanController.getFoodPan)

router.post("/breastfeeding", BreastfeedingController.create)
router.get("/breastfeeding", BreastfeedingController.getFoodPan)

router.post("/milestones", MilestoneController.create)
router.get("/milestones", MilestoneController.milestone)

router.post("/apoloapi", ApoloController.apolo)
router.post("/apoloapi_access_token", ApoloController.token)

export { router };