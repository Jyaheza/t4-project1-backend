const { CohereClient } = require('cohere-ai');

const cohere = new CohereClient({
    token: 'DZNo51TV64zekbXBMJnmzTZXpd8kET5bFMCw5Sdz',
});

/**
 * 
 * Invokes Cohere API to generate story text.
 * @param {*} preamble - The prepatory statement for the LLM to generate text
 * @param {*} chatInputMessage - The generated text that is to be sent to the LLM as a request or input.
 * @returns New story as a string
 */
async function startCohereChat(preamble, chatInputMessage) {

    let responseTexts = '';

    const chatStream = await cohere.chatStream({
        preamble: preamble,
        message: chatInputMessage,
    });

    for await (const message of chatStream) {
        if (message.eventType === 'text-generation') {
            responseTexts += message.text;
        }
    }

    return responseTexts;
}

module.exports = { startCohereChat };

