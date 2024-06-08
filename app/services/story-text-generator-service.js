const { startCohereChat } = require("./cohere-client-service");
const db = require("../models");
const Story = db.story;

/**
 * Generates a story based on the parameters provided
 * @param {*} userId 
 * @param {*} storyParams 
 * @returns story object
 */
async function generateNewStory(userId, storyParams) {
  // Call the LLM service to generate the story text
  const preamble = 'You are a writer of children\'s stories';
  let parametersText = '';

  let chatInputMessage = 'Please write me a 5 paragraph childrens bedtime story and include a title to the story. ';

  if (storyParams.length !== 0) {
    storyParams.forEach(parameter => {
      parametersText += `${parameter.key}: ${parameter.value}, `;
    });
  }

  if (parametersText !== '') {
    chatInputMessage += ` Please use the following parameters to help build the content of the story. ${parametersText}`;
  }

  chatInputMessage += ` End the story extension in a way that leaves the plot open for continuation. 
    Do not say explicitaly that there will be another chapter, but rather build the plot in a 
    way that allows space for more story to be generated. Do not use phrases like "The End...for now." OR "To be continued...". Do not put a story title in this story text.`;

  const storyTextResponse = await startCohereChat(preamble, chatInputMessage);

  const storyTitleResponse = await startCohereChat(preamble, `Given this story text ${storyTextResponse} please generate an accurate title for the story. Don't put the title in quotations.`);

  const story = {
    userId: userId,
    story: storyTextResponse,
    title: storyTitleResponse,
    parentId: null,
    createdAt: new Date(),
    updatedAt: null,
  };

  //save it
  await Story.create(story);

  return story;
}

/**
 * Generates a new chapter for an existing story based on given 
 * parameters and text from the existing story and chapters.
 * @param {*} storyContext 
 * @param {*} userId 
 * @param {*} storyParams 
 * @param {*} parentStoryId 
 * @returns 
 */
async function generateStoryExtension(storyContext, userId, storyParams, parentStoryId) {
  let parametersText = '';

  if (storyParams.length !== 0) {
    let i = 0;
    storyParams.forEach(parameter => {
      i++;
      if (parameter.value) {
        parametersText += `${parameter.key}: ${parameter.value}`;

        if(i === storyParams.length){
          parametersText += `.`;
        } else {
          parametersText += `, `;
        } 
      }
    });
  }

  // Call the LLM service to generate the story text
  const preamble = 'You are a writer of children\'s stories, who wants to extend an already written story with an engaging new entry.';

  let chatInputMessage = `Please generate a 5 paragraph extension of the following childrens bedtime story. 
    Please maintain plot continuity from provided story, even if there are new parameters that will be added with the extension 
    to the story.`;

  if (parametersText !== '') {
    chatInputMessage += ` Please use the following parameters to help build the content of the story extension. ${parametersText} `;
  }

  chatInputMessage += `Here is the existing story: ${storyContext}.`;

  chatInputMessage += ` End the story extension in a way that leaves the plot open for continuation. 
    Do not say explicitaly that there will be another chapter, but rather build the plot in a 
    way that allows space for more story to be generated. Do not use phrases like "The End...for now." OR "To be continued..."`;

  const storyText = await startCohereChat(preamble, chatInputMessage);

  const story = {
    userId: userId,
    story: storyText,
    title: "",
    parentId: parentStoryId,
    createdAt: new Date(),
    updatedAt: null,
  };

  //save it
  await Story.create(story);

  return story;
}

module.exports = { generateNewStory, generateStoryExtension };