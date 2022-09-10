/* 
* Title: Uptime Monitoring Application.
* folder: handle request and response.
* Description: A RESTFUl API to monitor up or down time of user defined links
* Author: Md Yasin Miah.
* Date: 25 FEB 2022
*/

//dependencies
const url = require('url');
const { StringDecoder } = require('string_decoder');
const routes = require('./routes');
const { notFoundHandler } = require('../handlers/routeHandlers/notFoundHandler');
const { parseJSON } = require('./utilities');

//app object - module scaffolding
const handler = {};

//handle request and response
handler.handleReqRes = (req, res) => {
    // request handling
    // get the url and parse it
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');
    const method = req.method.toLowerCase();
    const queryObject = parsedUrl.query;
    const headerObject = req.headers;


    const requiredProperties = {
        parsedUrl,
        path,
        trimmedPath,
        method,
        queryObject,
        headerObject
    }

    const decoder = new StringDecoder('utf-8');
    let myData = '';

    const chosenHandler = routes[trimmedPath] ? routes[trimmedPath] : notFoundHandler;

    req.on('data', (buffer) => {
        myData += decoder.write(buffer);
    })
    req.on('end', () => {
        myData += decoder.end();

        requiredProperties.body = parseJSON(myData);

        chosenHandler(requiredProperties, (statusCode, payload) => {
            statusCode = typeof (statusCode) === 'number' ? statusCode : 500;
            payload = typeof (payload) === 'object' ? payload : {};
            const payloadString = JSON.stringify(payload);

            //return the final response
            res.setHeader('Context-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);
        });
    })

}
module.exports = handler;
