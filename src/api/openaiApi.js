import axios from "axios";

// Set this variable to true to use mock responses, or false to use the actual API.
const USE_MOCKS = false;

// Helper function to add delay.
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Get a chat completion from OpenAI's chat completions API.
 * If USE_MOCKS is true, a mock response will be returned after a 3 sec delay.
 * @param {Array} messages - Array of chat messages.
 * @param {string} OPENAI_API_KEY - Your OpenAI API key.
 * @returns {Promise<object>} API response data.
 */
export const getChatCompletion = async (messages, OPENAI_API_KEY) => {
    if (USE_MOCKS) {
        // Mock response for development/testing
        const mockResponse = {
            "id": "chatcmpl-BHpenK2coCnCdkftnF3GvMFhQ1WDP",
            "object": "chat.completion",
            "created": 1743589845,
            "model": "gpt-4-turbo-2024-04-09",
            "choices": [
              {
                "index": 0,
                "message": {
                  "role": "assistant",
                  "content": "For creating an anime avatar that reflects the style and pose of the person in the uploaded image, you can use the following description as a prompt for an AI art generator:\n\n\"Create an anime character inspired by a stylish man striking a confident pose in front of a blue SUV. The character has gray hair styled in a modern fashion and is wearing sunglasses. He is dressed in an intricate, detailed long-sleeved shirt featuring a black and white pattern with hints of purple, paired with blue jeans. He is standing with his arms extended slightly, touching the top of the car tires, conveying a sense of relaxed confidence. The background is simple with a hint of a sunny atmosphere near a residential entrance. Focus on vibrant colors and an energetic vibe typical of anime illustrations.\"\n\nThis description should help in creating an avatar that captures the essence and style of the person in the image while transforming it into an anime art style.",
                  "refusal": null,
                  "annotations": []
                },
                "logprobs": null,
                "finish_reason": "stop"
              }
            ],
            "usage": {
              "prompt_tokens": 799,
              "completion_tokens": 182,
              "total_tokens": 981,
              "prompt_tokens_details": {
                "cached_tokens": 0,
                "audio_tokens": 0
              },
              "completion_tokens_details": {
                "reasoning_tokens": 0,
                "audio_tokens": 0,
                "accepted_prediction_tokens": 0,
                "rejected_prediction_tokens": 0
              }
            },
            "service_tier": "default",
            "system_fingerprint": "fp_101a39fff3"
          }
          
        await delay(3000);
        return mockResponse;
    }

    try {
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "You are a helpful AI assistant." },
                    ...messages.map((msg) => ({ role: msg.role, content: msg.content })),
                ],
                temperature: 0.7,
                max_tokens: 500,
            },
            {
                headers: {
                    Authorization: `Bearer ${OPENAI_API_KEY}`,
                    "Content-Type": "application/json",
                },
                timeout: 30000,
            }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Generate an image by passing a prompt to OpenAI's image generation API.
 * If USE_MOCKS is true, a mock response will be returned after a 3 sec delay.
 * @param {string} prompt - The full prompt to generate image.
 * @param {string} OPENAI_API_KEY - Your OpenAI API key.
 * @returns {Promise<object>} API response data.
 */
export const generateImageWithDalle = async (prompt, OPENAI_API_KEY) => {
    if (USE_MOCKS) {
        // Mock response for development/testing
        const mockResponse = {
            data: {
                "created": 1743589866,
                "data": [
                    {
                        "revised_prompt": "Create an anime character inspired by a stylish man striking a confident pose in front of a blue SUV. The character should have gray hair styled in a modern fashion and is wearing sunglasses. He is dressed in an intricate, detailed long-sleeved shirt featuring a black and white pattern with hints of purple, paired with blue jeans. He is standing with his arms extended slightly, touching the top of the car tires, conveying a sense of relaxed confidence. The background is simple with a hint of a sunny atmosphere near a residential entrance. This scene should be done with vibrant colors and an energetic vibe typical of anime illustrations, but incorporate the soft lighting and magical atmosphere of the styles prior to 1912 art era.",
                        "url": "https://oaidalleapiprodscus.blob.core.windows.net/private/org-irxYipLQ2BB6dCjQxM21XnmK/user-yVhg46v6gYgH9EnEW9kCg7rR/img-S8kB7GuA52gDNIhPpqZ2iVMT.png?st=2025-04-02T09%3A31%3A06Z&se=2025-04-02T11%3A31%3A06Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=d505667d-d6c1-4a0a-bac7-5c84a87759f8&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-04-01T21%3A54%3A07Z&ske=2025-04-02T21%3A54%3A07Z&sks=b&skv=2024-08-04&sig=BJuOXuJLmzE1otwlJHT018vXQaIOOmn1OwI5AM9abZk%3D"
                    }
                ]
            },
        };
        await delay(3000);
        return mockResponse;
    }

    try {
        const data = JSON.stringify({
            model: "dall-e-3",
            prompt: prompt,
            n: 1,
            size: "1024x1024",
        });

        const response = await axios.request({
            method: "post",
            maxBodyLength: Infinity,
            url: "https://api.openai.com/v1/images/generations",
            headers: {
                Authorization: `Bearer ${OPENAI_API_KEY}`,
                "Content-Type": "application/json",
            },
            data: data,
            timeout: 60000,
        });
        return response;
    } catch (error) {
        throw error;
    }
};

/**
 * Get a prompt from GPT-4 based on an uploaded image.
 * If USE_MOCKS is true, a mock response will be returned after a 3 sec delay.
 * @param {string} imageUrl - URL of the uploaded image.
 * @param {string} OPENAI_API_KEY - Your OpenAI API key.
 * @returns {Promise<object>} API response data.
 */
export const getGpt4Prompt = async (imageUrl, OPENAI_API_KEY) => {
  if (USE_MOCKS) {
    const mockResponse = {
      id: "chatcmpl-BHpi9hmUvH2vJ0S9iMqaALHVxrRZO",
      object: "chat.completion",
      created: 1743590053,
      model: "gpt-4-turbo-2024-04-09",
      choices: [
        {
          index: 0,
          message: {
            role: "assistant",
            content:
              "To create an anime avatar based on the uploaded image, here's a detailed prompt:\n\n\"Create a pair of anime-style avatars inspired by a young couple. The male avatar should have stylish, wind-swept hair, wear a tropical print shirt, white pants, and fashionable sunglasses, capturing a cool and relaxed vibe. The female avatar should feature mid-length hair adorned with a cute beret, dressed in a vibrant lime green, tiered sundress, accessorizing with a casual crossbody bag, and wearing chic eyeglasses. Both characters should be portrayed standing in a lush garden setting, evoking a sense of a sunny, cheerful day out. Emphasize bright, vivid colors and a background that hints at a stately, historical building in the distance.\"",
            refusal: null,
            annotations: [],
          },
          logprobs: null,
          finish_reason: "stop",
        },
      ],
      usage: {
        prompt_tokens: 799,
        completion_tokens: 189,
        total_tokens: 988,
        prompt_tokens_details: { cached_tokens: 0, audio_tokens: 0 },
        completion_tokens_details: { reasoning_tokens: 0, audio_tokens: 0, accepted_prediction_tokens: 0, rejected_prediction_tokens: 0 },
      },
      service_tier: "default",
      system_fingerprint: "fp_101a39fff3",
    };
    await delay(3000);
    return mockResponse;
  }

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4-turbo",
        messages: [
          { role: "system", content: "You are an AI assistant that can analyze images and text." },
          {
            role: "user",
            content: [
              { type: "text", text: "suggest a prompt to create an anime avatar like uploaded image" },
              { type: "image_url", image_url: { url: imageUrl } },
            ],
          },
        ],
        max_tokens: 500,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        timeout: 30000,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};