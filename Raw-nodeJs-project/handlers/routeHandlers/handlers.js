/* 
* Title: Uptime Monitoring Application.
* folder: handle routers.
* Description: A RESTFUl API to monitor up or down time of user defined links
* Author: Md Yasin Miah.
* Date: 25 FEB 2022
*/

// module scaffolding
const handler = {};

// about route
handler.about = (requiredProperties, callBack) => {
    callBack(200, {
        message: 'this is the about url',
    });
}

module.exports = handler;