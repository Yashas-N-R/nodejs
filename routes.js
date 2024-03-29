const fs = require('fs');

function requestHandler(req, res) {
    const url = req.url;
    const method = req.method;
    if (url === '/') {
        fs.readFile('message.txt', (err, data) => {

            res.setHeader('Content-Type', 'text/html');
            console.log("data is " + data);
            res.write('<html>');
            res.write('<head><title>First Page</title><head>');
            res.write(`<body>${data}</body>`);
            res.write(
                '<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form></body>'
            );
            res.write('</html>');
            return res.end();
        });

    }
    else if (url === '/message' && method === 'POST') {
        const body = [];
        req.on('data', chunk => {
            console.log(chunk);
            body.push(chunk);
        });
        return req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            const message = parsedBody.split('=')[0];
            fs.writeFile('message.txt', message, () => {
                console.log(message);
                res.statusCode = 302;
                res.setHeader('Location', '/');
                return res.end();
            });
        });
    }
}

module.exports = requestHandler;