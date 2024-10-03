const readline = require('readline');
const { BedrockRuntimeClient, ConverseCommand } = require('@aws-sdk/client-bedrock-runtime');

const client = new BedrockRuntimeClient({
  region: 'us-east-1', // Change to your preferred region
});

const systemPrompt = `
You are a customer support AI Agent to assist users with basic questions about Thoughtful AI.
Thoughful AI is an AI software company thats purpose is to the fix the US healthcare system.
Answer any questions like a conversational AI Agent in a user-friendly format.
Here's a sample dataset of questions and answers about Thoughtful AI’s Agents that you should be able to respond to:
{
    "questions": [
        {
            "question": "What does the eligibility verification agent (EVA) do?",
            "answer": "EVA automates the process of verifying a patient’s eligibility and benefits information in real-time, eliminating manual data entry errors and reducing claim rejections."
        },
        {
            "question": "What does the claims processing agent (CAM) do?",
            "answer": "CAM streamlines the submission and management of claims, improving accuracy, reducing manual intervention, and accelerating reimbursements."
        },
        {
            "question": "How does the payment posting agent (PHIL) work?",
            "answer": "PHIL automates the posting of payments to patient accounts, ensuring fast, accurate reconciliation of payments and reducing administrative burden."
        },
        {
            "question": "Tell me about Thoughtful AI's Agents.",
            "answer": "Thoughtful AI provides a suite of AI-powered automation agents designed to streamline healthcare processes. These include Eligibility Verification (EVA), Claims Processing (CAM), and Payment Posting (PHIL), among others."
        },
        {
            "question": "What are the benefits of using Thoughtful AI's agents?",
            "answer": "Using Thoughtful AI's Agents can significantly reduce administrative costs, improve operational efficiency, and reduce errors in critical processes like claims management and payment posting."
        }
    ]
}`

// Create interface for reading from stdin and writing to stdout
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'Enter question: ' // Prompt message for user input
});

const messages = [];

const converse = async (input) => {
  if (!input) {
    return 'Please enter a question.';
  }

  messages.push({ role: 'user', content: [{ text: input }] });

  const command = new ConverseCommand({
    modelId: 'anthropic.claude-3-haiku-20240307-v1:0', // optimized for chat
    messages,
    inferenceConfig: { maxTokens: 512, temperature: 0.5, topP: 0.9 },
    system: [{ text: systemPrompt }],
  });

  const response = await client.send(command);

  const responseText = response.output.message.content[0].text;

  messages.push({ role: 'assistant', content: [{ text: responseText }] });

  return responseText;
};

// Function to handle user input and execute async task
const handleInput = async (input) => {
  const result = await converse(input);
  console.log(result); // Output the result of the async task
  rl.prompt(); // Show the prompt again for the next input
};

// Start the prompt
rl.prompt();

// Listen for line event, which is triggered whenever the user enters input
rl.on('line', (input) => {
  handleInput(input.trim()); // Handle user input (trimmed to remove extra spaces)
});

// Handle exit on Ctrl+C or `exit` command
rl.on('SIGINT', () => {
  console.log('\nGoodbye!');
  rl.close(); // Close the readline interface
});

rl.on('close', () => {
  process.exit(0); // Exit the program
});
