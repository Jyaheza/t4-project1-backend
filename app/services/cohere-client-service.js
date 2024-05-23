const { CohereClient } = require('cohere-ai');

const cohere = new CohereClient({
    token: 'DZNo51TV64zekbXBMJnmzTZXpd8kET5bFMCw5Sdz',
});

/**
 * Invokes Cohere API to generate story text.
 * 
 * @param {*} parameters - an iterable (list) of objects with a 
 * key and value * field in the, these "parameters" are passed to the Cohere API prompt
 * 
 * @returns New story as a string .
 */
async function startCohereChat(parameters) {
    const preamble = 'You are a writer of children\'s stories';
    let responseTexts = '';
    let parametersText = '';
    let chatInputMessage = 'Can you please write me a 5 paragraph childrens bedtime story?';

    if(parameters.length !== 0){
       parameters.forEach(parameter => {
            parametersText += `${parameter.key}: ${parameter.value}, `;
       }); 
    }

    if(parametersText !== ''){
        chatInputMessage += ` Please use the following parameters to help build the content of the story. ${parametersText}`;
    }

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

