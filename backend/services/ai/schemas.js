const { z } = require("zod");

const storySchema = z.object({
  title: z.string(),
  image: z.string(),
  content: z.string(),
});

const storyPartSchema = z.object({
  content: z.string(),
  image: z.string(),
});

const aiAgentPayloadSchema = z.object({
  storyInfo: z.string().describe("Information about the requested story as a string"),
  to: z.string().describe("Ethereum address to mint the NFT to"),
  language: z.string().optional().default("en").describe("Language for the story"),
});

module.exports = {
  storySchema,
  storyPartSchema,
  aiAgentPayloadSchema,
};
