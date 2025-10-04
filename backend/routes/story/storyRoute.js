const express = require("express");

const { getStories, createStory } = require("../../controllers/story/storyController");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(getStories);

router
  .route("/create")
  .post(createStory);

module.exports = router; 