import { frontEndGenBranchPrompt } from '../LLM/prompt/task.js'
import { getChain } from '../LLM/prompt/utils.js'
import { model } from '../util/client.js'
import logger from '../config/logger.js';
import { HumanMessage } from "@langchain/core/messages";

// 生成前端分支名称
export async function genFrontEndBranchName(description) {
  const chain = getChain(frontEndGenBranchPrompt, model);
  try {
      const result = await chain.invoke({
          messages: [
            new HumanMessage(
              description
            ),
          //   new AIMessage("J'adore la programmation."),
          //   new HumanMessage("What did you just say?"),
          ],
        });
      // const result = await openAIClient.createChatCompletion({
      //     model: config.openai.model,
      //     messages: [{
      //         role: 'user',
      //         content: description
      //     }]
      // });
      console.log(result, 'result')
      return [result.content, result.response_metadata?.tokenUsage?.totalTokens ?? 0];
  } catch (error) {
      logger.error(`API error: ${error}`);
      throw error;
  }
}