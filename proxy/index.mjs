import bodyParser from "body-parser";
import {JSONRPCClient} from "json-rpc-2.0";
import fetch from 'node-fetch';
import express from "express";
import cors from "cors";

const app = express();
const port = 3000;

// Configuring bodyParser to read the body of POST requests
app.use(bodyParser.json());
// Use cors as middleware to enable CORS on all routes
app.use(cors({
    origin: '*',
    preflightContinue: true,
    optionsSuccessStatus: 204,
    credentials: true,
}));

// Endpoint that acts as a proxy
app.post('/proxy', async (req, res) => {
    const headers = {
        'Content-Type': 'application/json, text/plain, */*',
        '_tclrequestverificationkey': 'KSDHSDFOGQ5WERYTUIQWERTYUISDFG1HJZXCVCXBN2GDSMNDHKVKFsVBNf',
        'Referer': 'http://192.168.1.1/index.html',
        'Connection': 'keep-alive'
    };
    if (req.query.token) {
        headers['_tclrequestverificationtoken'] = req.query.token;
    }
    const RPCClient = new JSONRPCClient((payload) => {
        fetch('http://192.168.1.1/jrd/webapi', {
            method: 'POST',
            headers,
            body: JSON.stringify(payload),
            insecureHTTPParser: true
        })
            .then((response) => {
                if (response.status === 200) {
                    return response
                        .json()
                        .then((jsonRPCResponse) => {
                            RPCClient.receive(jsonRPCResponse);
                            res.send(jsonRPCResponse);
                        });
                } else if (payload.id !== undefined) {
                    return Promise.reject(new Error(response.statusText));
                }
            });
    });

    RPCClient.requestAdvanced(req.body);
});

// Start the server
app.listen(port, () => {
    console.log(`Proxy server running on http://localhost:${port}`);
});
