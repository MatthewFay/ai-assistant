# ai-assistant
AI Assistant. Uses Amazon Bedrock and Anthropic claude 3 haiku model to enable customer assistant (AI agent) conversation. Claude 3 Haiku is optimized for chat scenarios and quick responses, and is very powerful in this scenario. We use the Bedrock Converse API along with a system prompt to give contextual information, such as purpose.

To run:
1. Configure AWS on your local machine with credentials
2. Make sure Amazon Bedrock is setup, i.e., enable Anthropic claude 3 haiku model in Amazon Console web UI
3. `node index` to execute the program
4. Type a question and press enter
5. Response will show in console
6. Can type another question if desired
7. Ctrl + C to exit

