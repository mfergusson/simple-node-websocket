const express = require('express');
const WebSocket = require('ws');
const app = express();
const server = require('http').createServer(app);

const wss = new WebSocket.Server({ server: server })

wss.on('connection', function connection(ws) {
    setInterval(() => {
        ws.send(JSON.stringify({
            type: 'Heartbeat',
        }));
    }, 1000);

    let counter = 0;
    ws.on('message', function incoming(data) {
        try {
            const jsonData = JSON.parse(data);
            switch (jsonData) {
                case 'subscribe':
                    const timeWhenMessageReceived = new Date().getTime();
                    setTimeout(() => {
                        ws.send(JSON.stringify({
                            type: 'Subscribe',
                            message: 'Subscribed!',
                            updatedAt: timeWhenMessageReceived,
                            subscriptions: counter + 1,
                        }))
                        counter += 1;
                    }, 4000);
                    break;
                case 'unsubscribe':
                    setTimeout(() => {
                        ws.send(JSON.stringify({
                            type: 'Unsubscribe',
                            message: 'Unsubscribed!',
                            updatedAt: new Date().getTime(),
                            subscriptions: counter - 1,
                        }))
                        counter -= 1;
                    }, 8000);
                    break;
                case 'countSubscribers':
                    ws.send(JSON.stringify({
                        type: 'Count Subscribers',
                        count: counter,
                        updatedAt: new Date().getTime(),
                    }));
                    break;
                default:
                    ws.send(JSON.stringify({
                        type: 'Error',
                        error: 'Requested method not implemented',
                        updatedAt: new Date().getTime(),
                    }));
            }
        } catch (e) {
            ws.send(JSON.stringify({
                type: 'Error',
                error: `Bad formatted payload, non JSON, ${e}`,
                updatedAt: new Date().getTime(),
            }));
        }
    });

    // on message error?
});

server.listen('3000', () => {
    console.log('Example app listening on port 3000')
})