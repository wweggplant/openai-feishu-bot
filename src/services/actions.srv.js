import { OpenAIApi } from 'openai';
import config from '../config/config.js';
import { configuration } from '../util/client.js';
const openAIClient = new OpenAIApi(configuration);
function insertRecord() {
  // Code for inserting a new record into a multi-dimensional table in a Lark document
}
// 使用function-call, 定义一个函数, 用于在飞书文档中插入一条新的记录.
function getCurrentWeather(location, unit = "fahrenheit") {
  if (location.toLowerCase().includes("tokyo")) {
    return JSON.stringify({ location: "Tokyo", temperature: "10", unit });
  } else if (location.toLowerCase().includes("san francisco")) {
    return JSON.stringify({ location: "San Francisco", temperature: "72", unit });
  } else if (location.toLowerCase().includes("paris")) {
    return JSON.stringify({ location: "Paris", temperature: "22", unit });
  } else {
    return JSON.stringify({ location, temperature: "unknown" });
  }
}

// runConversation
async function runConversation(content) {
  // Code for running a conversation with OpenAI
  const messages = [
    { role: "user", content },
  ];
  const tools = [
    {
      type: "function",
      function: {
        name: "get_current_weather",
        description: "Get the current weather in a given location",
        parameters: {
          type: "object",
          properties: {
            location: {
              type: "string",
              description: "The city and state, e.g. San Francisco, CA",
            },
            unit: { type: "string", enum: ["celsius", "fahrenheit"] },
          },
          required: ["location"],
        },
      },
    },
  ];
  const response = await openAIClient.createChatCompletion({
    model: config.openai.model,
    messages: messages,
    tools: tools,
    tool_choice: "auto", // auto is default, but we'll be explicit
  })
  const responseMessage = response.data.choices[0].message;
  const toolCalls = responseMessage.tool_calls;
  if (responseMessage.tool_calls) {
      // Step 3: call the function
      // Note: the JSON response may not always be valid; be sure to handle errors
      const availableFunctions = {
        get_current_weather: getCurrentWeather,
      }; // only one function in this example, but you can have multiple
      messages.push(responseMessage); // extend conversation with assistant's reply
      for (const toolCall of toolCalls) {
        const functionName = toolCall.function.name;
        const functionToCall = availableFunctions[functionName];
        const functionArgs = JSON.parse(toolCall.function.arguments);
        const functionResponse = functionToCall(
          functionArgs.location,
          functionArgs.unit
        );
        messages.push({
          tool_call_id: toolCall.id,
          role: "tool",
          name: functionName,
          content: functionResponse,
        }); // extend conversation with function response
      }
      const secondResponse = await openAIClient.createChatCompletion({
        model: config.openai.model,
        messages: messages,
      }); // get a new response from the model where it can see the function response
      return secondResponse.data.choices[0]?.message ?? '';
  }
}

export { insertRecord, runConversation };