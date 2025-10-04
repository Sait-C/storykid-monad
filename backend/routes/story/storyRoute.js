const express = require("express");

const Story = require("../../models/story/Story");
const advancedResults = require("../../middleware/advancedResults");
const photoUpload = require("../../middleware/photoUpload");

const {
  getStories,
  getStoryById,
  createStory,
  updateStory,
  deleteStory,
} = require("../../controllers/story/storyController");

// Include story parts router
const storyPartRouter = require("./storyPartRoute");

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require("../../middleware/auth");

// Re-route into story parts router
router.use("/:storyId/storyparts", storyPartRouter);

// Protect all routes
router.use(protect);

router
  .route("/")
  .get(advancedResults(Story, "parts"), getStories)
  .post(createStory);

router
  .route("/:id")
  .get(getStoryById)
  .put(photoUpload("file", false), updateStory)
  .delete(deleteStory);

module.exports = router; 