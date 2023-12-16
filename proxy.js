import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cors from 'cors'
const app = express();

// CORS middleware
app.use(cors())
app.use((req, res, next) => {
    // Set the CORS headers
    // res.header('Access-Control-Allow-Origin', '*');
    // res.header('Access-Control-Allow-Methods', 'GET POST PUT DELETE OPTIONS PATCH'); // Add the methods you need
    // res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    // Continue to the next middleware
    next();
});

// Define a proxy route
const apiProxy = createProxyMiddleware('/api', {
    target: 'http://localhost:8080', // Replace with the actual API server URL
    changeOrigin: true,
});

// Use the proxy route
app.use('/api', apiProxy);

// Start the proxy server
const port = 3000; // You can choose any available port
app.listen(port, () => {
    console.log(`Proxy server is running on http://localhost:${port}`);
});
