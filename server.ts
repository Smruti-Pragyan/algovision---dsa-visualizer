import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize environment variables
dotenv.config();

// ES Module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Chatbot 
// Make sure to add GEMINI_API_KEY to your .env file
const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

// ==========================================
// --- API ENDPOINTS ---
// ==========================================

// 1. AI Tutor Chatbot Endpoint
app.post('/api/chat', async (req: Request, res: Response) => {
    try {
        const { message } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: 'Message is required.' });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(message);
        const responseText = result.response.text();

        res.json({ reply: responseText });
    } catch (error) {
        console.error("Chatbot Initialization/Execution Error:", error);
        res.status(500).json({ error: 'Failed to process AI response.' });
    }
});

// 2. Code Execution Endpoint (Piston Proxy)
app.post('/api/execute', async (req: Request, res: Response) => {
    try {
        const { language, version, sourceCode } = req.body;

        if (!language || !sourceCode) {
            return res.status(400).json({ error: 'Language and source code are required.' });
        }

        // Piston API payload
        const payload = {
            language: language,
            version: version || "*", 
            files: [{ content: sourceCode }]
        };

        const response = await fetch('https://emacsx.com/api/v2/execute', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Execution failed');
        }

        res.json({
            output: data.run?.stdout || '',
            error: data.run?.stderr || '',
            exitCode: data.run?.code || 0
        });

    } catch (error) {
        console.error("Code Execution Error:", error);
        res.status(500).json({ error: 'Failed to execute code on the server.' });
    }
});

// 3. Health check endpoint for hosting platforms
app.get('/api/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'OK', message: 'AlgoVision server is running.' });
});

// ==========================================
// --- FRONTEND SERVING ---
// ==========================================

// Serve the static files from the Vite build directory
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// Catch-all route to serve the React app for any unhandled requests (React Router support)
app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(distPath, 'index.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is successfully running on port ${PORT}`);
});