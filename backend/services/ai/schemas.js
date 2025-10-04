const { z } = require("zod");

const storySchema = z.object({
  title: z.string(),
  summary: z.string(),
  thumbnailImage: z.string(),
});

const storyPartSchema = z.object({
  content: z.string(),
  image: z.string(),
  audio: z.string().optional(),
});

module.exports = {
  storySchema,
  storyPartSchema,
};
