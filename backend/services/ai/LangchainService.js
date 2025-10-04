const { ChatGroq } = require("@langchain/groq");
const { storySchema, storyPartSchema } = require("./schemas");
const { client, Status } = require("imaginesdk");

class LangchainService {
  constructor() {
    this.model = new ChatGroq({
      apiKey: process.env.GROQ_API_KEY,
      model: "llama-3.3-70b-versatile",
      temperature: 0.8,
      maxRetries: 3,
    });

    this.imagine = client(`${process.env.IMAGINEART_API_KEY}`);
  }

  /**
   * Creates a new story based on a theme.
   * The method takes a theme as input and returns structured data containing
   * a story title, summary, content, and a thumbnail image.
   */
  async createStory(childProfile, theme, language = "en", progressTracker = null) {
    if (progressTracker) {
      progressTracker.update("story.progress.preparing", 10);
    }

    const prompt = `
      Create an engaging children's story based on the theme: "${theme}".
      The child profile is: ${JSON.stringify(childProfile)}.
      You need to create a story that is appropriate for the child's age and interests.
      The child's name is ${childProfile.firstName}.
      You need to use the child's name in the story.

      The story should be:
      - Educational and entertaining
      - Appropriate for children
      - Contain positive messages and lessons
      - Be creative and imaginative
      
      Important: Provide the response in ${language} language.
      Important: The story should be in ${language} language. DO NOT USE ANY OTHER LANGUAGE.
      Important: The image of the story should be in this style:
        Style Guide:
          - 3D-rendered but stylized like Pixar or DreamWorks animation.
          - Use soft lighting, dreamy atmosphere, and warm pastel tones.
          - Key palette: Warm Yellow (#FFD166), Soft Pink (#FFAFCC), Playful Red (#EF476F), Gentle Green (#06D6A0), Calm Blue (#118AB2), Creamy White (#FFFBF0).
          - Environment filled with depth using blurred background, floating particles, and rim light.
          - Character posture: sitting, reading, riding a creature, or smiling with wonder.
          - Background should feel immersive: twilight forest, magical night sky, sunset with fantasy creatures.
          - Add emotional warmth, charm, innocence, and imagination.
          - High-resolution, cinematic framing, slight vignette for focus.

          Do *NOT* use realistic human textures or harsh shadows — keep everything soft, rounded, glowing, and child-friendly.
        Important: The image prompt must be in english.
      Format the response exactly like this example:
      {
        "title": "The Story Title",
        "summary": "A brief summary of the story (2-3 sentences)",
        "thumbnailImage": "A detailed description for generating an image that represents the story"
      }
    `;

    const structuredLlm = this.model.withStructuredOutput(storySchema);
    let result = await structuredLlm.invoke(prompt);
    console.log("🔍 Result: ", result);
    if (progressTracker) {
      progressTracker.update("story.progress.generatingThumbnail", 40);
    }

    // Generate thumbnail image
    const imagePrompt = result.thumbnailImage;
    const thumbnailImage = await this.generateImage(imagePrompt);

    // Update the result with the actual image
    result.thumbnailImage = thumbnailImage || "";

    if (progressTracker) {
      progressTracker.update("story.progress.complete", 60);
    }

    return result;
  }

  /**
   * Creates a new story part that continues an existing story.
   * The method takes the existing story content as input and returns
   * structured data containing the next part of the story, an image, and audio.
   */
  async createStoryPart(childProfile, existingContent, choiceOfChild, language = "en", progressTracker = null) {
    if (progressTracker) {
      progressTracker.update("story.part.progress.preparing", 10);
    }

    const prompt = `
      The child profile is: ${JSON.stringify(childProfile)}.
      The child's name is ${childProfile.firstName}.
      You need to create a story that is appropriate for the child's age and interests.
      You need to use the child's name in the story.
      You need to continue the story from the last part based on the choice of child: ${choiceOfChild}.
      You need to give two options which are related to the story to the child to choose from at the end of the story part.

      Continue this children's story:
      
      "${existingContent}"
      
      Write the next part of the story that:
      - Continues the narrative naturally
      - Develops the characters and plot
      - Maintains the same tone and style
      - Ends at an interesting point that invites continuation
      
      Important: Provide the response in ${language} language.
      Important: The story should be in ${language} language. DO NOT USE ANY OTHER LANGUAGE.
      Important: The image of the story part should be in this style:
        Style Guide:
        - 3D-rendered but stylized like Pixar or DreamWorks animation.
        - Use soft lighting, dreamy atmosphere, and warm pastel tones.
        - Key palette: Warm Yellow (#FFD166), Soft Pink (#FFAFCC), Playful Red (#EF476F), Gentle Green (#06D6A0), Calm Blue (#118AB2), Creamy White (#FFFBF0).
        - Environment filled with depth using blurred background, floating particles, and rim light.
        - Character posture: sitting, reading, riding a creature, or smiling with wonder.
        - Background should feel immersive: twilight forest, magical night sky, sunset with fantasy creatures.
        - Add emotional warmth, charm, innocence, and imagination.
        - High-resolution, cinematic framing, slight vignette for focus.

        Do *NOT* use realistic human textures or harsh shadows — keep everything soft, rounded, glowing, and child-friendly.
        Important: The image prompt must be in english.
      Format the response exactly like this example:
      {
        "content": "The next part of the story (1-2 paragraphs)",
        "image": "A detailed description for generating an image that represents this part of the story"
      }
    `;

    console.log("📝 Story part is generating...");
    const structuredLlm = this.model.withStructuredOutput(storyPartSchema);
    let result = await structuredLlm.invoke(prompt);

    if (progressTracker) {
      progressTracker.update("story.part.progress.generatingImageAudio", 40);
    }

    // Generate image for the story part
    const imagePrompt = result.image;
    const audioText = result.content;

    console.log("🎨 Image Prompt: ", result.image);
    console.log("🔊 Audio is generating...");
    const [storyPartImage, audioBase64] = await Promise.all([
      this.generateImage(imagePrompt),
    ]);

    // Update the result with the actual image and audio
    result.image = storyPartImage || "";
    result.audio = audioBase64 || "";

    return result;
  }

  async generateImage(prompt) {
    try {
      const response = await this.imagine.generations(prompt, {});
      if (response.status() === Status.OK) {
        const image = response.getOrThrow();
        const base64Image = image.asImageSrc();
        return base64Image;
      } else {
        console.log(response.errorOrThrow());
      }
      return null;
    } catch (error) {
      console.error("Error generating image:", error);
      return null;
    }
  } 
}

module.exports = {
  aiService: new LangchainService(),
};
