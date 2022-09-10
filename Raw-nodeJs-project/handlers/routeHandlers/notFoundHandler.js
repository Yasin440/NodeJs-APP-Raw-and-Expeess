/* 
* Title: Uptime Monitoring Application.
* Folder: not found handle 404 not found.
* Description: A RESTFUl API to monitor up or down time of user defined links
* Author: Md Yasin Miah.
* Date: 25 FEB 2022
*/

// module scaffolding
const handler = {};

// about route
handler.notFoundHandler = (requiredProperties, callBack) => {
    callBack(404, {
        message: 'Your requested URL not found (404)',
    });
}

module.exports = handler;