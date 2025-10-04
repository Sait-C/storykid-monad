const express = require("express");

const StoryPart = require("../../models/story/StoryPart");
const advancedResults = require("../../middleware/advancedResults");
const photoUpload = require("../../middleware/photoUpload");

const {
  getStoryParts,
  getStoryPartById,
  createStoryPart,
  updateStoryPart,
  deleteStoryPart,
} = require("../../controllers/story/storyPartController");

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require("../../middleware/auth");

// Protect all routes
router.use(protect);

router
  .route("/")
  .get(advancedResults(StoryPart), getStoryParts)
  .post(createStoryPart);

router
  .route("/:id")
  .get(getStoryPartById)
  .put(photoUpload("file", false), updateStoryPart)
  .delete(deleteStoryPart);

module.exports = router; 