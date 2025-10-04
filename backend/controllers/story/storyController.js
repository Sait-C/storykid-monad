const ErrorResponse = require("../../utils/errorResponse");
const ProgressService = require("../../services/socket/ProgressService");
const StoryKidNFTService = require("../../services/contract/StoryKidNFTService");
const { aiAgentPayloadSchema } = require("../../services/ai/schemas");

const asyncHandler = require("../../middleware/async");
const { aiService } = require("../../services/ai/LangchainService");

// Initialize NFT service
const nftService = new StoryKidNFTService();

// @desc Get all stories / Get stories of specific child profile
// @route GET /api/v1/stories
// @route GET /api/v1/childprofiles/:childProfileId/stories
// @access Private
exports.getStories = asyncHandler(async (req, res, next) => {  
    res.status(200).json({  
      success: true,
      count: 0,
      data: [],
    });
});

// @desc Create new story from AI agent request
// @route POST /api/v1/stories/create
// @access Private
exports.createStory = asyncHandler(async (req, res, next) => {
  try {
    // Validate the AI agent payload
    const validationResult = aiAgentPayloadSchema.safeParse(req.body);
    if (!validationResult.success) {
      return next(
        new ErrorResponse(`Invalid payload: ${validationResult.error.issues.map(i => i.message).join(', ')}`, 400)
      );
    }

    const { storyInfo, to, language = "en" } = validationResult.data;

    // Validate Ethereum address
    if (!/^0x[a-fA-F0-9]{40}$/.test(to)) {
      return next(
        new ErrorResponse(`Invalid Ethereum address format`, 400)
      );
    }

    // Initialize progress tracker
    const progressService = new ProgressService(req.app.get('io'));
    const progressTracker = progressService.createProgressTracker(
      to, // Use the 'to' address as the session identifier
      'story'
    );

    progressTracker.update("story.progress.starting", 0);

    // Generate story using AI service
    const generatedStory = await aiService.createStoryFromAgentRequest(
      storyInfo,
      language,
      progressTracker
    );
    
    progressTracker.update("story.progress.minting", 80);

    // Mint the story as an NFT
    const mintResult = await nftService.mintNFT(
      to,
      generatedStory.title,
      generatedStory.content,
      generatedStory.image
    );

    if (!mintResult.success) {
      progressTracker.error(mintResult.error);
      return next(
        new ErrorResponse(`Failed to mint NFT: ${mintResult.error}`, 500)
      );
    }

    progressTracker.complete({
      tokenId: mintResult.tokenId,
      transactionHash: mintResult.transactionHash,
      blockNumber: mintResult.blockNumber
    });

    res.status(201).json({
      success: true,
      message: 'Story created and minted as NFT successfully',
      data: {
        story: {
          title: generatedStory.title,
          content: generatedStory.content,
          image: generatedStory.image
        },
        nft: {
          tokenId: mintResult.tokenId,
          transactionHash: mintResult.transactionHash,
          blockNumber: mintResult.blockNumber,
          owner: to
        }
      }
    });

  } catch (error) {
    return next(
      new ErrorResponse(`Error creating story: ${error.message}`, 500)
    );
  }
});