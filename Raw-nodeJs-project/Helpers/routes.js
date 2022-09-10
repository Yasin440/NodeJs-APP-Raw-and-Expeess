/* 
* Title: Uptime Monitoring Application.
* folder: Manage routers.
* Description: A RESTFUl API to monitor up or down time of user defined links
* Author: Md Yasin Miah.
* Date: 25 FEB 2022
*/

//dependencies
const { about } = require('../handlers/routeHandlers/handlers');
const { userHandler } = require('../handlers/routeHandlers/userHandler');
const { tokenHandler } = require('../handlers/routeHandlers/tokenHandler');

const routes = {
    about: about,
    user: userHandler,
    token: tokenHandler,
};

module.exports = routes;