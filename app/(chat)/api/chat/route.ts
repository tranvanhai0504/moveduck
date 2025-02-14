import {
  type Message,
  convertToCoreMessages,
  createDataStreamResponse,
  experimental_generateImage,
  streamObject,
  streamText,
} from "ai";
import { z } from "zod";
import type { NextRequest } from "next/server";

import { customModel, imageGenerationModel } from "@/lib/ai";
import { models } from "@/lib/ai/models";
import {
  codePrompt,
  systemPrompt,
  updateDocumentPrompt,
} from "@/lib/ai/prompts";
import {
  deleteChatById,
  getChatById,
  getDocumentById,
  saveChat,
  saveMessages,
} from "@/lib/db/queries";
import type { Suggestion } from "@/lib/db/schema";
import {
  generateUUID,
  getMostRecentUserMessage,
  calculateRSI,
  analyzeRSI,
  calculateBB,
  analyzeBB,
  calculateSMA,
  calculateEMA,
  calculateMACD,
  calculateStochastic,
  calculateATR,
  calculateOBV,
  analyzeSMA,
  analyzeMACD,
  analyzeStochastic,
  analyzeATR,
  analyzeOBV,
  calculateWMA,
  calculateHMA,
  calculateADX,
  calculateParabolicSAR,
  calculateCCI,
  calculateROC,
  analyzeADX,
  analyzeCCI,
  analyzeROC,
  calculateWilliamsR,
  calculateCMO,
  calculateKC,
  calculateDC,
  calculateCMF,
  calculateVWAP,
  analyzeWilliamsR,
  analyzeCMO,
  analyzeKC,
  analyzeDC,
  analyzeCMF,
  analyzeVWAP,
  analyzeSAR,
  sanitizeResponseMessages,
} from "@/lib/utils";
import { generateTitleFromUserMessage } from "../../actions";

export const maxDuration = 60;

type AllowedTools =
  | "createDocument"
  | "updateDocument"
  | "requestSuggestions"
  | "getWeather"
  | "getCryptoPrice";

const blocksTools: AllowedTools[] = [
  "createDocument",
  "updateDocument",
  "requestSuggestions",
];

const weatherTools: AllowedTools[] = ["getWeather"];
const cryptoTools: AllowedTools[] = ["getCryptoPrice"];

const allTools: AllowedTools[] = [
  ...blocksTools,
  ...weatherTools,
  ...cryptoTools,
];

export async function POST(request: NextRequest) {
  const {
    id,
    messages,
    modelId,
    userId,
  }: { id: string; messages: Array<Message>; modelId: string; userId: string } =
    await request.json();

  const model = models.find((model) => model.id === modelId);

  if (!model) {
    return new Response("Model not found", { status: 404 });
  }

  const coreMessages = convertToCoreMessages(messages);
  const userMessage = getMostRecentUserMessage(coreMessages);

  if (!userMessage) {
    return new Response("No user message found", { status: 400 });
  }

  try {
    const chat = await getChatById({ id });

    if (!chat) {
      const title = await generateTitleFromUserMessage({
        message: userMessage,
      });
      await saveChat({ id, userId, title });
    }

    const userMessageId = generateUUID();

    await saveMessages({
      messages: [
        {
          ...userMessage,
          id: userMessageId,
          createdAt: new Date(),
          chatId: id,
        },
      ],
    });

    return createDataStreamResponse({
      execute: (dataStream) => {
        dataStream.writeData({
          type: "user-message-id",
          content: userMessageId,
        });

        const result = streamText({
          model: customModel(model.apiIdentifier),
          system: systemPrompt,
          messages: coreMessages,
          maxSteps: 5,
          experimental_activeTools: allTools,
          tools: {
            getWeather: {
              description: "Get the current weather at a location",
              parameters: z.object({
                latitude: z.number(),
                longitude: z.number(),
              }),
              execute: async ({ latitude, longitude }) => {
                const response = await fetch(
                  `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&hourly=temperature_2m&daily=sunrise,sunset&timezone=auto`
                );

                const weatherData = await response.json();
                return weatherData;
              },
            },
            getCrypto: {
              description: "Get the current price of a cryptocurrency",
              parameters: z.object({
                coinId: z.string(),
                currency: z.string().default("usd"),
              }),
              execute: async ({ coinId, currency }) => {
                const response = await fetch(
                  `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=${currency}&include_24h_change=true`
                );

                const priceData = await response.json();
                return priceData;
              },
            },
            createDocument: {
              description:
                "Create a document for a writing or content creation activities like image generation. This tool will call other functions that will generate the contents of the document based on the title and kind.",
              parameters: z.object({
                title: z.string(),
                kind: z.enum(["text", "code", "image"]),
              }),
              execute: async ({ title, kind }) => {
                const id = generateUUID();
                let draftText = "";

                dataStream.writeData({
                  type: "id",
                  content: id,
                });

                dataStream.writeData({
                  type: "title",
                  content: title,
                });

                dataStream.writeData({
                  type: "kind",
                  content: kind,
                });

                dataStream.writeData({
                  type: "clear",
                  content: "",
                });

                if (kind === "text") {
                  const { fullStream } = streamText({
                    model: customModel(model.apiIdentifier),
                    system:
                      "Write about the given topic. Markdown is supported. Use headings wherever appropriate.",
                    prompt: title,
                  });

                  for await (const delta of fullStream) {
                    const { type } = delta;

                    if (type === "text-delta") {
                      const { textDelta } = delta;

                      draftText += textDelta;
                      dataStream.writeData({
                        type: "text-delta",
                        content: textDelta,
                      });
                    }
                  }

                  dataStream.writeData({ type: "finish", content: "" });
                } else if (kind === "code") {
                  const { fullStream } = streamObject({
                    model: customModel(model.apiIdentifier),
                    system: codePrompt,
                    prompt: title,
                    schema: z.object({
                      code: z.string(),
                    }),
                  });

                  for await (const delta of fullStream) {
                    const { type } = delta;

                    if (type === "object") {
                      const { object } = delta;
                      const { code } = object;

                      if (code) {
                        dataStream.writeData({
                          type: "code-delta",
                          content: code ?? "",
                        });

                        draftText = code;
                      }
                    }
                  }

                  dataStream.writeData({ type: "finish", content: "" });
                } else if (kind === "image") {
                  const { image } = await experimental_generateImage({
                    model: imageGenerationModel,
                    prompt: title,
                    n: 1,
                  });

                  draftText = image.base64;

                  dataStream.writeData({
                    type: "image-delta",
                    content: image.base64,
                  });

                  dataStream.writeData({ type: "finish", content: "" });
                }

                return {
                  id,
                  title,
                  kind,
                  content:
                    "A document was created and is now visible to the user.",
                };
              },
            },
            updateDocument: {
              description: "Update a document with the given description.",
              parameters: z.object({
                id: z.string().describe("The ID of the document to update"),
                description: z
                  .string()
                  .describe("The description of changes that need to be made"),
              }),
              execute: async ({ id, description }) => {
                const document = await getDocumentById({ id });

                if (!document) {
                  return {
                    error: "Document not found",
                  };
                }

                const { content: currentContent } = document;
                let draftText = "";

                dataStream.writeData({
                  type: "clear",
                  content: document.title,
                });

                if (document.kind === "text") {
                  const { fullStream } = streamText({
                    model: customModel(model.apiIdentifier),
                    system: updateDocumentPrompt(currentContent, "text"),
                    prompt: description,
                    experimental_providerMetadata: {
                      openai: {
                        prediction: {
                          type: "content",
                          content: currentContent,
                        },
                      },
                    },
                  });

                  for await (const delta of fullStream) {
                    const { type } = delta;

                    if (type === "text-delta") {
                      const { textDelta } = delta;

                      draftText += textDelta;
                      dataStream.writeData({
                        type: "text-delta",
                        content: textDelta,
                      });
                    }
                  }

                  dataStream.writeData({ type: "finish", content: "" });
                } else if (document.kind === "code") {
                  const { fullStream } = streamObject({
                    model: customModel(model.apiIdentifier),
                    system: updateDocumentPrompt(currentContent, "code"),
                    prompt: description,
                    schema: z.object({
                      code: z.string(),
                    }),
                  });

                  for await (const delta of fullStream) {
                    const { type } = delta;

                    if (type === "object") {
                      const { object } = delta;
                      const { code } = object;

                      if (code) {
                        dataStream.writeData({
                          type: "code-delta",
                          content: code ?? "",
                        });

                        draftText = code;
                      }
                    }
                  }

                  dataStream.writeData({ type: "finish", content: "" });
                } else if (document.kind === "image") {
                  const { image } = await experimental_generateImage({
                    model: imageGenerationModel,
                    prompt: description,
                    n: 1,
                  });

                  draftText = image.base64;

                  dataStream.writeData({
                    type: "image-delta",
                    content: image.base64,
                  });

                  dataStream.writeData({ type: "finish", content: "" });
                }

                return {
                  id,
                  title: document.title,
                  kind: document.kind,
                  content: "The document has been updated successfully.",
                };
              },
            },
            requestSuggestions: {
              description: "Request suggestions for a document",
              parameters: z.object({
                documentId: z
                  .string()
                  .describe("The ID of the document to request edits"),
              }),
              execute: async ({ documentId }) => {
                const document = await getDocumentById({ id: documentId });

                if (!document || !document.content) {
                  return {
                    error: "Document not found",
                  };
                }

                const suggestions: Array<
                  Omit<Suggestion, "userId" | "createdAt" | "documentCreatedAt">
                > = [];

                const { elementStream } = streamObject({
                  model: customModel(model.apiIdentifier),
                  system:
                    "You are a help writing assistant. Given a piece of writing, please offer suggestions to improve the piece of writing and describe the change. It is very important for the edits to contain full sentences instead of just words. Max 5 suggestions.",
                  prompt: document.content,
                  output: "array",
                  schema: z.object({
                    originalSentence: z
                      .string()
                      .describe("The original sentence"),
                    suggestedSentence: z
                      .string()
                      .describe("The suggested sentence"),
                    description: z
                      .string()
                      .describe("The description of the suggestion"),
                  }),
                });

                for await (const element of elementStream) {
                  const suggestion = {
                    originalText: element.originalSentence,
                    suggestedText: element.suggestedSentence,
                    description: element.description,
                    id: generateUUID(),
                    documentId: documentId,
                    isResolved: false,
                  };

                  dataStream.writeData({
                    type: "suggestion",
                    content: suggestion,
                  });

                  suggestions.push(suggestion);
                }

                return {
                  id: documentId,
                  title: document.title,
                  kind: document.kind,
                  message: "Suggestions have been added to the document",
                };
              },
            },
            getCryptoPrice: {
              description:
                "Get cryptocurrency price, chart data and technical analysis",
              parameters: z.object({
                coinId: z.string(),
                currency: z.string().default("usd"),
                days: z.number().default(14),
                indicator: z.string(),
              }),
              execute: async ({ coinId, currency, days, indicator }) => {
                // Fetch current price data
                const priceResponse = await fetch(
                  `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=${currency}&include_24h_change=true&include_24h_vol=true&include_market_cap=true`
                );
                const priceData = await priceResponse.json();

                // Fetch OHLCV data for technical analysis
                const ohlcvResponse = await fetch(
                  `https://api.coingecko.com/api/v3/coins/${coinId}/ohlc?vs_currency=${currency}&days=${days}`
                );
                const ohlcvData = await ohlcvResponse.json();

                // Calculate technical indicators based on user request
                let technicalAnalysis = {
                  indicator: "RSI",
                  data: [],
                  analysis: {
                    signal: "Neutral",
                    strength: "No analysis available",
                    description: "Could not calculate indicator",
                  },
                };

                switch (indicator.toLowerCase()) {
                  case "sma": {
                    const smaData = calculateSMA(ohlcvData, 20);
                    technicalAnalysis = {
                      indicator: "SMA",
                      data: smaData as never[],
                      analysis: analyzeSMA(
                        ohlcvData[ohlcvData.length - 1][4],
                        smaData[smaData.length - 1]
                      ),
                    };
                    break;
                  }
                  case "ema": {
                    const emaData = calculateEMA(ohlcvData, 20);
                    technicalAnalysis = {
                      indicator: "EMA",
                      data: emaData as never[],
                      analysis: analyzeSMA(
                        ohlcvData[ohlcvData.length - 1][4],
                        emaData[emaData.length - 1]
                      ),
                    };
                    break;
                  }
                  case "macd": {
                    const macdData = calculateMACD(ohlcvData);
                    technicalAnalysis = {
                      indicator: "MACD",
                      data: macdData as any,
                      analysis: analyzeMACD(macdData),
                    };
                    break;
                  }
                  case "stoch": {
                    const stochData = calculateStochastic(ohlcvData);
                    technicalAnalysis = {
                      indicator: "Stochastic",
                      data: stochData as never[],
                      analysis: analyzeStochastic(
                        stochData[stochData.length - 1]
                      ),
                    };
                    break;
                  }
                  case "atr": {
                    const atrData = calculateATR(ohlcvData);
                    technicalAnalysis = {
                      indicator: "ATR",
                      data: atrData as never[],
                      analysis: analyzeATR(
                        atrData[atrData.length - 1],
                        ohlcvData[ohlcvData.length - 1][4]
                      ),
                    };
                    break;
                  }
                  case "obv": {
                    const obvData = calculateOBV(ohlcvData);
                    technicalAnalysis = {
                      indicator: "OBV",
                      data: obvData as never[],
                      analysis: analyzeOBV(obvData.slice(-2)),
                    };
                    break;
                  }
                  case "bb":
                  case "bollinger": {
                    const bbData = calculateBB(ohlcvData);
                    technicalAnalysis = {
                      indicator: "BB",
                      data: bbData as never[],
                      analysis: analyzeBB(bbData[bbData.length - 1]),
                    };
                    break;
                  }
                  case "rsi": {
                    const rsiData = calculateRSI(ohlcvData);
                    technicalAnalysis = {
                      indicator: "RSI",
                      data: rsiData as never[],
                      analysis: analyzeRSI(rsiData[rsiData.length - 1]),
                    };
                    break;
                  }
                  case "wma": {
                    const wmaData = calculateWMA(ohlcvData, 20);
                    technicalAnalysis = {
                      indicator: "WMA",
                      data: wmaData as never[],
                      analysis: analyzeSMA(
                        ohlcvData[ohlcvData.length - 1][4],
                        wmaData[wmaData.length - 1]
                      ),
                    };
                    break;
                  }
                  case "hma": {
                    const hmaData = calculateHMA(ohlcvData, 20);
                    technicalAnalysis = {
                      indicator: "HMA",
                      data: hmaData as never[],
                      analysis: analyzeSMA(
                        ohlcvData[ohlcvData.length - 1][4],
                        hmaData[hmaData.length - 1]
                      ),
                    };
                    break;
                  }
                  case "adx": {
                    const adxData = calculateADX(ohlcvData);
                    technicalAnalysis = {
                      indicator: "ADX",
                      data: adxData as any,
                      analysis: analyzeADX(adxData),
                    };
                    break;
                  }
                  case "sar":
                  case "parabolicsar": {
                    const sarData = calculateParabolicSAR(ohlcvData);
                    technicalAnalysis = {
                      indicator: "Parabolic SAR",
                      data: sarData as never[],
                      analysis: analyzeSAR(sarData[sarData.length - 1]),
                    };
                    break;
                  }
                  case "cci": {
                    const cciData = calculateCCI(ohlcvData);
                    technicalAnalysis = {
                      indicator: "CCI",
                      data: cciData as never[],
                      analysis: analyzeCCI(cciData[cciData.length - 1]),
                    };
                    break;
                  }
                  case "roc": {
                    const rocData = calculateROC(ohlcvData);
                    technicalAnalysis = {
                      indicator: "ROC",
                      data: rocData as never[],
                      analysis: analyzeROC(rocData[rocData.length - 1]),
                    };
                    break;
                  }
                  case "williamsr": {
                    const wrData = calculateWilliamsR(ohlcvData);
                    technicalAnalysis = {
                      indicator: "Williams %R",
                      data: wrData as never[],
                      analysis: analyzeWilliamsR(wrData[wrData.length - 1]),
                    };
                    break;
                  }
                  case "cmo": {
                    const cmoData = calculateCMO(ohlcvData);
                    technicalAnalysis = {
                      indicator: "CMO",
                      data: cmoData as never[],
                      analysis: analyzeCMO(cmoData[cmoData.length - 1]),
                    };
                    break;
                  }
                  case "kc": {
                    const kcData = calculateKC(ohlcvData);
                    technicalAnalysis = {
                      indicator: "KC",
                      data: kcData as never[],
                      analysis: analyzeKC(kcData[kcData.length - 1]),
                    };
                    break;
                  }
                  case "dc": {
                    const dcData = calculateDC(ohlcvData);
                    technicalAnalysis = {
                      indicator: "DC",
                      data: dcData as never[],
                      analysis: analyzeDC(dcData[dcData.length - 1]),
                    };
                    break;
                  }
                  case "cmf": {
                    const cmfData = calculateCMF(ohlcvData);
                    technicalAnalysis = {
                      indicator: "CMF",
                      data: cmfData as never[],
                      analysis: analyzeCMF(cmfData[cmfData.length - 1]),
                    };
                    break;
                  }
                  case "vwap": {
                    const vwapData = calculateVWAP(ohlcvData);
                    technicalAnalysis = {
                      indicator: "VWAP",
                      data: vwapData as never[],
                      analysis: analyzeVWAP(
                        ohlcvData[ohlcvData.length - 1][4],
                        vwapData[vwapData.length - 1]
                      ),
                    };
                    break;
                  }
                  default: {
                    technicalAnalysis = {
                      indicator,
                      data: [],
                      analysis: {
                        signal: "Neutral",
                        strength: "Unsupported indicator",
                        description: `Analysis for ${indicator} is not currently supported`,
                      },
                    };
                  }
                }

                return {
                  price: {
                    usd: priceData[coinId][currency],
                    usd_24h_change: priceData[coinId][`${currency}_24h_change`],
                    usd_24h_vol: priceData[coinId][`${currency}_24h_vol`],
                    usd_market_cap: priceData[coinId][`${currency}_market_cap`],
                  },
                  technicalAnalysis,
                  metadata: {
                    id: coinId,
                    currency,
                    days,
                  },
                };
              },
            },
          },
          onFinish: async ({ response }) => {
            if (userId) {
              try {
                const responseMessagesWithoutIncompleteToolCalls =
                  sanitizeResponseMessages(response.messages);

                await saveMessages({
                  messages: responseMessagesWithoutIncompleteToolCalls.map(
                    (message) => {
                      const messageId = generateUUID();

                      if (message.role === "assistant") {
                        dataStream.writeMessageAnnotation({
                          messageIdFromServer: messageId,
                        });
                      }

                      return {
                        id: messageId,
                        chatId: id,
                        role: message.role,
                        content: message.content,
                        createdAt: new Date(),
                      };
                    }
                  ),
                });
              } catch (error) {
                console.error("Failed to save chat");
              }
            }
          },
          experimental_telemetry: {
            isEnabled: true,
            functionId: "stream-text",
          },
        });

        result.mergeIntoDataStream(dataStream);
      },
    });
  } catch (error) {
    console.log(error);
    return new Response("Unauthorized", { status: 401 });
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const userId = searchParams.get("userId");

  if (!id) {
    return new Response("Not Found", { status: 404 });
  }

  const chat = await getChatById({ id });

  if (!chat) {
    return new Response("Not Found", { status: 404 });
  }

  if (chat.userId !== userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  await deleteChatById({ id });

  return new Response("Chat deleted", { status: 200 });
}
