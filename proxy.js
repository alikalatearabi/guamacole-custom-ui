import express from "express";
import httpProxy from 'http-proxy'
import cors from 'cors'

const app = express();
app.use(cors());
const proxy = httpProxy.createProxyServer();

// Define the target URL of your Guacamole back-end server
const targetUrl = 'http://localhost:80';

// Define a route that will forward requests to the Guacamole back-end server
app.all('/guacamole/*', (req, res) => {
    proxy.web(req, res, { target: targetUrl });
});

// Start the proxy server on a port of your choice
const port = 3000;
app.listen(port, () => {
    console.log(`Proxy server is running on port ${port}`);
});