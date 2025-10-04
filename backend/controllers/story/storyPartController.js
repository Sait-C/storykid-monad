const ErrorResponse = require("../../utils/errorResponse");
const StoryPart = require("../../models/story/StoryPart");
const Story = require("../../models/story/Story");
const ChildProfile = require("../../models/child/ChildProfile");
const ProgressService = require("../../services/socket/ProgressService");

const asyncHandler = require("../../middleware/async");
const {
  uploadToCloudinary,
  removeFromCloudinary,
} = require("../../utils/cloudinary");
const { aiService } = require("../../services/ai/LangchainService");


// @desc Get all story parts / Get story parts of specific story
// @route GET /api/v1/storyparts
// @route GET /api/v1/stories/:storyId/storyparts
// @access Private
exports.getStoryParts = asyncHandler(async (req, res, next) => {
  if (req.params.storyId) {

    // GET story parts of specific story
    const story = await Story.findById(req.params.storyId);

    if (!story) {
      return next(
        new ErrorResponse(`No Story with the id of ${req.params.storyId}`, 404)
      );
    }

    // Get the child profile to check permissions
    const childProfile = await ChildProfile.findById(story.owner);

    // Make sure user has permission for this operation
    if (
      req.user._id.toString() !== childProfile.user?.toString() &&
      req.user.role !== "admin"
    ) {
      return next(
        new ErrorResponse(
          `User does not have permission for this operation`,
          401
        )
      );
    }

    const storyParts = await StoryPart.find({ story: req.params.storyId });


    res.status(200).json({
      success: true,
      count: storyParts.length,
      data: storyParts,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc Get single story part
// @route GET /api/v1/storyparts/:id
// @access Private
exports.getStoryPartById = asyncHandler(async (req, res, next) => {

  const storyPart = await StoryPart.findById(req.params.id);

  if (!storyPart) {
    return next(
      new ErrorResponse(`No Story Part with the id of ${req.params.id}`, 404)
    );
  }

  // Get the story to check permissions
  const story = await Story.findById(storyPart.story);
  const childProfile = await ChildProfile.findById(story.owner);

  // Make sure user has permissions
  if (
    req.user._id.toString() !== childProfile.user?.toString() &&
    req.user.role !== "admin"
  ) {
    return next(
      new ErrorResponse(`User does not have permission for this operation`, 401)
    );
  }


  res.status(200).json({
    success: true,
    data: storyPart,
  });
});

// @desc Create new story part
// @route POST /api/v1/stories/:storyId/storyparts
// @access Private
exports.createStoryPart = asyncHandler(async (req, res, next) => {
  req.body.story = req.params.storyId;

  const story = await Story.findById(req.params.storyId);

  if (!story) {
    return next(
      new ErrorResponse(`No Story with the id of ${req.params.storyId}`, 404)
    );
  }

  // Get the child profile to check permissions
  const childProfile = await ChildProfile.findById(story.owner).populate({
    path: "user",
    populate: {
      path: "userProfile",
      select: "language",
      populate: {
        path: "language",
        select: "name isoCode"
      }
    },
  });

  if (!childProfile) {
    return next(
      new ErrorResponse(
        `No Child Profile with the id of ${story.owner}`,
        404
      )
    );
  }

  // Make sure user has permissions for this operation
  if (
    req.user._id.toString() !== childProfile.user?._id.toString() &&
    req.user.role !== "admin"
  ) {
    return next(
      new ErrorResponse(`User does not have permission for this operation`, 401)
    );
  }

  // Initialize progress tracker
  const progressService = new ProgressService(req.app.get('io'));
  const progressTracker = progressService.createProgressTracker(
    req.params.storyId,
    'storyPart'
  );

  try {
    progressTracker.update("story.part.progress.generating", 0);

    // Get all existing story parts to provide context
    const existingParts = await StoryPart.find({
      story: req.params.storyId,
    }).sort("createdAt");

    // Combine story description with existing parts content for context
    let existingContent = `Story Description: ${story.description}\n\n`;
    if (existingParts.length > 0) {
      existingParts.forEach((part) => {
        existingContent += "\n\n" + part.content;
      });
    }

    // Get language preference or default to English
    const language = childProfile.user.userProfile.language.isoCode || "en";
    const choiceOfChild = req.body.choice || "no child choice, continue";

    // Generate story part using AI service
    const generatedPart = await aiService.createStoryPart(
      childProfile,
      existingContent,
      choiceOfChild,
      language,
      progressTracker
    );

    progressTracker.update("story.part.progress.saving", 90);

    // Map the generated content
    req.body.content = generatedPart.content;
    req.body.image = generatedPart.image;
    req.body.audio = generatedPart.audio;

    const storyPart = await StoryPart.create(req.body);


    progressTracker.complete(storyPart);

    res.status(201).json({
      success: true,
      data: storyPart,
    });
  } catch (error) {
    progressTracker.error(error.message);
    return next(
      new ErrorResponse(`Error generating story part: ${error.message}`, 500)
    );
  }
});

// @desc Update story part
// @route PUT /api/v1/storyparts/:id
// @access Private
exports.updateStoryPart = asyncHandler(async (req, res, next) => {
  let storyPart = await StoryPart.findById(req.params.id);

  if (!storyPart) {
    return next(
      new ErrorResponse(`No Story Part with the id of ${req.params.id}`, 404)
    );
  }

  // Get the story to check permissions
  const story = await Story.findById(storyPart.story);
  const childProfile = await ChildProfile.findById(story.owner);

  // Make sure user has permissions for this operation
  if (
    req.user._id.toString() !== childProfile.user?.toString() &&
    req.user.role !== "admin"
  ) {
    return next(
      new ErrorResponse(`User does not have permission for this operation`, 401)
    );
  }

  storyPart = await StoryPart.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: storyPart,
  });
});

// @desc Delete story part
// @route DELETE /api/v1/storyparts/:id
// @access Private
exports.deleteStoryPart = asyncHandler(async (req, res, next) => {
  const storyPart = await StoryPart.findById(req.params.id);

  if (!storyPart) {
    return next(
      new ErrorResponse(`No Story Part with the id of ${req.params.id}`, 404)
    );
  }

  // Get the story to check permissions
  const story = await Story.findById(storyPart.story);
  const childProfile = await ChildProfile.findById(story.owner);

  // Make sure user has permissions for this operation
  if (
    req.user._id.toString() !== childProfile.user?.toString() &&
    req.user.role !== "admin"
  ) {
    return next(
      new ErrorResponse(`User does not have permission for this operation`, 401)
    );
  }

  await storyPart.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});
