require('dotenv').config();

const { generateNewStory, generateStoryExtension } = require('../app/services/story-text-generator-service');
const { startCohereChat } = require('../app/services/cohere-client-service');
const db = require('../app/models');
const Story = db.story;

jest.mock('../app/services/cohere-client-service');
jest.mock('../app/models', () => ({
  story: {
    create: jest.fn(),
  },
}));

describe('Story Text Generator Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generateNewStory', () => {
    it('should generate a new story and save it', async () => {
      startCohereChat.mockResolvedValueOnce('This is a generated story text.');
      startCohereChat.mockResolvedValueOnce('Generated Story Title');

      const userId = 1;
      const storyParams = [{ key: 'genre', value: 'fantasy' }];

      const story = await generateNewStory(userId, storyParams);

      expect(startCohereChat).toHaveBeenCalledTimes(2);
      expect(startCohereChat).toHaveBeenNthCalledWith(1, 'You are a writer of children\'s stories', expect.stringContaining('Please write me a 5 paragraph childrens bedtime story'));
      expect(startCohereChat).toHaveBeenNthCalledWith(2, 'You are a writer of children\'s stories', expect.stringContaining('Given this story text This is a generated story text. please generate an accurate title'));

      expect(Story.create).toHaveBeenCalledWith(expect.objectContaining({
        userId,
        story: 'This is a generated story text.',
        title: 'Generated Story Title',
        parentId: null,
      }));

      expect(story).toEqual(expect.objectContaining({
        userId,
        story: 'This is a generated story text.',
        title: 'Generated Story Title',
        parentId: null,
      }));
    });
  });

  describe('generateStoryExtension', () => {
    it('should generate a story extension and save it', async () => {
      startCohereChat.mockResolvedValueOnce('This is a generated story extension.');

      const userId = 1;
      const storyParams = [{ key: 'theme', value: 'adventure' }];
      const parentStoryId = 2;
      const storyContext = 'Once upon a time...';

      const story = await generateStoryExtension(storyContext, userId, storyParams, parentStoryId);

      expect(startCohereChat).toHaveBeenCalledTimes(1);
      expect(startCohereChat).toHaveBeenCalledWith('You are a writer of children\'s stories, who wants to extend an already written story with an engaging new entry.', expect.stringContaining('Please generate a 5 paragraph extension of the following childrens bedtime story'));

      expect(Story.create).toHaveBeenCalledWith(expect.objectContaining({
        userId,
        story: 'This is a generated story extension.',
        title: '',
        parentId: parentStoryId,
      }));

      expect(story).toEqual(expect.objectContaining({
        userId,
        story: 'This is a generated story extension.',
        title: '',
        parentId: parentStoryId,
      }));
    });
  });
});
