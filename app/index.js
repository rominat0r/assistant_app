const {VertexAI} = require('@google-cloud/vertexai');
const {ElevenLabsClient, ElevenLabs, play} = require("elevenlabs");

// Initialize Vertex with your Cloud project and location
const vertex_ai = new VertexAI({project: 'webapp-389506', location: 'us-central1'});
const model = 'gemini-1.5-pro-001';

// Instantiate the models
const generativeModel = vertex_ai.preview.getGenerativeModel({
  model: model,
  generationConfig: {
    'maxOutputTokens': 8192,
    'temperature': 1,
    'topP': 0.95,
    'safetySettings': [
      {
        'category': 'HARM_CATEGORY_HATE_SPEECH',
        'threshold': 'BLOCK_MEDIUM_AND_ABOVE'
      },
      {
        'category': 'HARM_CATEGORY_DANGEROUS_CONTENT',
        'threshold': 'BLOCK_MEDIUM_AND_ABOVE'
      },
      {
        'category': 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        'threshold': 'BLOCK_MEDIUM_AND_ABOVE'
      },
      {
        'category': 'HARM_CATEGORY_HARASSMENT',
        'threshold': 'BLOCK_MEDIUM_AND_ABOVE'
      },
    ],
    'systemInstruction': {
      parts: [{text: `You are a helpful service agent. It is a phone call, so sound as if you are one. The user is likely to ask you about info from this table: ...`}]
    }
  }
});

const chat = generativeModel.startChat();

async function sendMessage(message) {
  const streamResult = await chat.sendMessageStream(message);
  let responseText = '';
  for await (const chunk of streamResult.stream) {
    responseText += chunk.candidates[0].content.parts[0].text;
  }
  return responseText;
}

async function generateContent(message) {
  const response = await sendMessage(message);
  console.log('Generated response:', response);

  const client = new ElevenLabsClient({ apiKey: "sk_0c4e9cb762433fd8a7426d6c438ded693ae7c742ad6fc693" });
  const audioStream = await client.textToSpeech.convert("pMsXgVXv3BLzUgSXRplE", {
    optimize_streaming_latency: ElevenLabs.OptimizeStreamingLatency.Zero,
    output_format: ElevenLabs.OutputFormat.Mp32205032,
    text: response,
    voice_settings: {
        stability: 0.1,
        similarity_boost: 0.3,
        style: 0.2
    }
  });

  play(audioStream);
}

generateContent('What is the phone number of Kpo Logistics?');
