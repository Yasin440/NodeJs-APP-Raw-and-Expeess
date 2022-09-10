/* 
* Title: Uptime Monitoring Application
* Description; A RESTFUl API to monitor up or down time of user defined links
* Author: Md Yasin Miah.
* Date: 25 FEB 2022
*/

//dependencies
const http = require('http');
const { handleReqRes } = require('./Helpers/handleReqRes');
const data = require('./library/data');

//app object - module scaffolding
const app = {};

/*
====testing file system====
*/
// data.delete('test', 'newFile', (err) => {
//     console.log(err);
// });
// data.update('test', 'newFile', { name: 'Md Yasin Miah', post: 'junior react developer', salary: '35K' }, (err) => {
//     console.log(err);
// });
// data.read('test', 'newFile', (err,data) => {
//     console.log(err, data);
// });
// data.create('test', 'newFile',{name:'Yasin', post:'react developer'}, (err)=>{
//     console.log('the error is', err);
// });
/*************/

//configuration
app.config = {
    port: 5000,
};

//create server
app.createServer = () => {
    const server = http.createServer(app.handleResponse);
    server.listen(app.config.port, () => {
        console.log(`Raw node app listening port ${app.config.port}`);
    })
}

//handle request and response
app.handleResponse = handleReqRes;

//start the server
app.createServer();