import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY
});

export async function POST(request) {
  try {
    const { messages, temperature = 0.7, max_tokens = 150 } = await request.json();
    
    // Make request to OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",  // You can use gpt-4 for better results if available
      messages: messages,
      temperature: temperature,
      max_tokens: max_tokens,
    });
    
    // Return the response
    return NextResponse.json({ 
      message: completion.choices[0].message,
      usage: completion.usage
    });
  } catch (error) {
    console.error('GPT API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}