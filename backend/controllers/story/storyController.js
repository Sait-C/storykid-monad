const ErrorResponse = require("../../utils/errorResponse");
const Story = require("../../models/story/Story");
const ProgressService = require("../../services/socket/ProgressService");

const asyncHandler = require("../../middleware/async");
const { aiService } = require("../../services/ai/LangchainService");

// @desc Get all stories / Get stories of specific child profile
// @route GET /api/v1/stories
// @route GET /api/v1/childprofiles/:childProfileId/stories
// @access Private
exports.getStories = asyncHandler(async (req, res, next) => {
  if (req.params.childProfileId) {
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

    const stories = await Story.find({ owner: req.params.childProfileId });
  
    res.status(200).json({
      success: true,
      count: stories.length,
      data: stories,
    });
  }
    res.status(200).json(res.advancedResults);
});

// @desc Get single story
// @route GET /api/v1/stories/:id
// @access Private
exports.getStoryById = asyncHandler(async (req, res, next) => {
  const story = await Story.findById(req.params.id).populate("parts");

  if (!story) {
    return next(
      new ErrorResponse(`No Story with the id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: story,
  });
});

// @desc Create new story
// @route POST /api/v1/childprofiles/:childProfileId/stories
// @access Private
exports.createStory = asyncHandler(async (req, res, next) => {
  req.body.owner = req.params.childProfileId;

  const childProfile = await ChildProfile.findById(req.params.childProfileId).populate({
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
        `No Child Profile with the id of ${req.params.childProfileId}`,
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
    req.params.childProfileId,
    'story'
  );

  // If theme is provided, use AI to generate a story
  if (req.body.theme) {
    try {
      progressTracker.update("story.progress.starting", 0);

      // Get language preference or default to English
      const language = childProfile.user.userProfile.language.isoCode || "en";
      
      // Generate story using AI service
      const generatedStory = await aiService.createStory(
        childProfile, 
        req.body.theme, 
        language,
        progressTracker
      );
      
      progressTracker.update("story.progress.saving", 80);

      // Map the generated story to our model fields
      req.body.title = generatedStory.title;
      req.body.description = generatedStory.summary;
      req.body.thumbnailImage = generatedStory.thumbnailImage;

      const story = await Story.create(req.body);

      progressTracker.complete(story);

      res.status(201).json({
        success: true,
        data: story,
      });
    } catch (error) {
      progressTracker.error(error.message);
      return next(
        new ErrorResponse(`Error generating story: ${error.message}`, 500)
      );
    }
  } else {
    return next(
      new ErrorResponse(`Theme is required`, 400)
    );
  }
});

// @desc Update story
// @route PUT /api/v1/stories/:id
// @access Private
exports.updateStory = asyncHandler(async (req, res, next) => {
  let story = await Story.findById(req.params.id);

  if (!story) {
    return next(
      new ErrorResponse(`No Story with the id of ${req.params.id}`, 404)
    );
  }

  story = await Story.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });



  res.status(200).json({
    success: true,
    data: story,
  });
});

// @desc Delete story
// @route DELETE /api/v1/stories/:id
// @access Private
exports.deleteStory = asyncHandler(async (req, res, next) => {
  const story = await Story.findById(req.params.id);

  if (!story) {
    return next(
      new ErrorResponse(`No Story with the id of ${req.params.id}`, 404)
    );
  }



  await story.deleteOne();



  res.status(200).json({
    success: true,
    data: {},
  });
});
