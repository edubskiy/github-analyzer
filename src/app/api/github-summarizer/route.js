import { supabase } from '@/lib/supabaseClient';
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

export async function POST(request) {
  try {
    // Get API key from request header
    const apiKey = request.headers.get('x-api-key');
    
    if (!apiKey) {
      return Response.json(
        { error: 'API key is required' }, 
        { status: 401 }
      );
    }

    // Validate API key
    const { data: keyData, error: keyError } = await supabase
      .from('api_keys')
      .select('id, usage')
      .eq('key', apiKey)
      .single();

    if (keyError || !keyData) {
      return Response.json(
        { error: 'Invalid API key' }, 
        { status: 401 }
      );
    }

    // Get request body and parse GitHub URL
    const { githubUrl } = await request.json();
    
    // Convert github.com URL to raw content URL for README
    const readmeUrl = githubUrl
      .replace('github.com', 'raw.githubusercontent.com')
      .replace(/\/$/, '') + '/main/README.md';
      
    // Fetch README content
    const readmeResponse = await fetch(readmeUrl);
    let readmeContent = '';
    
    if (readmeResponse.ok) {
      readmeContent = await readmeResponse.text();
    } else {
      // Try master branch if main branch fails
      const masterReadmeUrl = readmeUrl.replace('/main/', '/master/');
      const masterResponse = await fetch(masterReadmeUrl);
      if (masterResponse.ok) {
        readmeContent = await masterResponse.text();
      } else {
        console.error('Failed to fetch README');
      }
    }
    
    if (!githubUrl) {
      return Response.json(
        { error: 'GitHub URL is required' }, 
        { status: 400 }
      );
    }

    // Initialize ChatOpenAI
    const chat = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      temperature: 0.7,
    });

    // Create the prompt for GitHub repository analysis
    const response = await chat.invoke([
      new SystemMessage(
        "You are a GitHub repository analyzer. Given a GitHub repository URL, " +
        "provide a concise summary of the repository, including its main purpose, " +
        "key features, and technical stack."
      ),
      new HumanMessage(`Please analyze this GitHub repository: ${githubUrl}`),
    ]);

    // Update API key usage count
    const { data: updatedKeyData, error: updateError } = await supabase
      .from('api_keys')
      .update({ usage: keyData.usage + 1 })
      .eq('id', keyData.id)
      .select();

    if (updateError) {
      console.error('Error updating usage count:', updateError);
    }

    console.log('Response content:', response.content); // Debug log
    try {
      return Response.json({ 
        summary: response.content 
      });
    } catch (err) {
      console.error('Error creating response:', err);
      return Response.json(
        { error: 'Failed to create response' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('GitHub summarizer error:', error);
    return Response.json(
      { error: 'Failed to process GitHub repository' }, 
      { status: 500 }
    );
  }
} 