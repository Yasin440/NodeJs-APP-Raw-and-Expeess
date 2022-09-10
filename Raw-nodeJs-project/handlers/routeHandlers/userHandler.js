/* 
* Title: Uptime Monitoring Application.
* folder: handle routers.
* Description: A RESTFUl API to monitor up or down time of user defined links
* Author: Md Yasin Miah.
* Date: 25 FEB 2022
*/

//dependencies
const data = require('../../library/data');
const { hash, parseJSON } = require('../../Helpers/utilities');
const tokenHandler = require('./tokenHandler')
// module scaffolding
const handler = {};

// about route
handler.userHandler = (requiredProperties, callBack) => {
    const acceptedMethod = ['get', 'put', 'post', 'delete'];
    if (acceptedMethod.indexOf(requiredProperties.method) > -1) {
        handler._users[requiredProperties.method](requiredProperties, callBack);
    } else {
        callBack(405);
    }
};

handler._users = {};

handler._users.post = (requiredProperties, callBack) => {
    const firstName =
        typeof (requiredProperties.body.firstName) === 'string'
            && requiredProperties.body.firstName.trim().length > 0
            ? requiredProperties.body.firstName
            : false;
    const lastName =
        typeof (requiredProperties.body.lastName) === 'string'
            && requiredProperties.body.lastName.trim().length > 0
            ? requiredProperties.body.lastName
            : false;
    const phone =
        typeof (requiredProperties.body.phone) === 'string'
            && requiredProperties.body.phone.trim().length === 11
            ? requiredProperties.body.phone
            : false;
    const password =
        typeof (requiredProperties.body.password) === 'string'
            && requiredProperties.body.password.trim().length > 0
            ? requiredProperties.body.password
            : false;
    const tosAgreement =
        typeof (requiredProperties.body.tosAgreement) === 'boolean'
            && requiredProperties.body.tosAgreement
            ? requiredProperties.body.tosAgreement
            : false;
    if (firstName && lastName && phone && password && tosAgreement) {
        //check if the user exist already
        data.read('users', phone, (err) => {
            if (err) {
                //get user info object
                let userInfoObject = {
                    firstName,
                    lastName,
                    phone,
                    password: hash(password),
                    tosAgreement
                }
                //save user info to data folder
                data.create('users', phone, userInfoObject, (err) => {
                    if (!err) {
                        callBack(200, {
                            'message': 'user insert successfully..!'
                        })
                    } else {
                        callBack(500, {
                            'error': 'Server site error to insert data!'
                        })
                    }
                })
            } else {
                callBack(500, {
                    'error': 'User already exist..!'
                })
            }
        });
    } else {
        callBack(404, {
            'error': 'There is an error on user request.....!'
        })
    }
};
handler._users.get = (requiredProperties, callBack) => {
    //check phone number is valid or not.
    const phone =
        typeof (requiredProperties.queryObject.phone) === 'string'
            && requiredProperties.queryObject.phone.trim().length === 11
            ? requiredProperties.queryObject.phone
            : false;
    if (phone) {
        //check authentication with token
        const token = typeof (requiredProperties.headerObject.token) === 'string' && requiredProperties.headerObject.token.trim().length == 23 ? requiredProperties.headerObject.token : false;
        tokenHandler._token.verify(token, phone, (tokenId) => {
            if (tokenId) {
                //read user Data
                data.read('users', phone, (error, u) => {
                    const user = { ...parseJSON(u) };
                    if (!error && u) {
                        delete user.password;
                        callBack(200, user);
                    } else {
                        callBack(404, {
                            "error": "Requested user is not found"
                        })
                    }
                })
            } else {
                callBack(403, {
                    error: 'Authentication Fail'
                })
            }
        })
    } else {
        callBack(404, {
            "error": "Requested user is not found"
        })
    }
};
handler._users.put = (requiredProperties, callBack) => {
    const firstName =
        typeof (requiredProperties.body.firstName) === 'string'
            && requiredProperties.body.firstName.trim().length > 0
            ? requiredProperties.body.firstName
            : false;
    const lastName =
        typeof (requiredProperties.body.lastName) === 'string'
            && requiredProperties.body.lastName.trim().length > 0
            ? requiredProperties.body.lastName
            : false;
    const phone =
        typeof (requiredProperties.body.phone) === 'string'
            && requiredProperties.body.phone.trim().length === 11
            ? requiredProperties.body.phone
            : false;
    const password =
        typeof (requiredProperties.body.password) === 'string'
            && requiredProperties.body.password.trim().length > 0
            ? requiredProperties.body.password
            : false;
    const tosAgreement =
        typeof (requiredProperties.body.tosAgreement) === 'boolean'
            && requiredProperties.body.tosAgreement
            ? requiredProperties.body.tosAgreement
            : false;
    if (firstName && lastName && phone && password && tosAgreement) {
        //check if the user exist already
        data.read('users', phone, (err, userData) => {
            if (!err && userData) {
                //check authentication with token
                const token = typeof (requiredProperties.headerObject.token) === 'string' && requiredProperties.headerObject.token.trim().length == 23 ? requiredProperties.headerObject.token : false;
                tokenHandler._token.verify(token, phone, (tokenId) => {
                    if (tokenId) {
                        //get user info object
                        let userInfoObject = {
                            firstName,
                            lastName,
                            phone,
                            password: hash(password),
                            tosAgreement
                        }
                        //save user info to data folder
                        data.update('users', phone, userInfoObject, (err) => {
                            if (err === "error=false") {
                                callBack(200, {
                                    'message': 'user updated successfully..!'
                                })
                            } else {
                                callBack(500, {
                                    'error': 'Server site error to insert data!'
                                })
                            }
                        })
                    } else {
                        callBack(403, {
                            error: 'Authentication Fail'
                        })
                    }
                })

            } else {
                callBack(500, {
                    'error': 'User not exist..!'
                })
            }
        });
    } else {
        callBack(404, {
            'error': 'There is an error on user request.....!'
        })
    }
};
handler._users.delete = (requiredProperties, callBack) => {
    //check phone number is valid or not.
    const phone =
        typeof (requiredProperties.queryObject.phone) === 'string'
            && requiredProperties.queryObject.phone.trim().length === 11
            ? requiredProperties.queryObject.phone
            : false;
    if (phone) {
        //check authentication with token
        const token = typeof (requiredProperties.headerObject.token) === 'string' && requiredProperties.headerObject.token.trim().length == 23 ? requiredProperties.headerObject.token : false;
        tokenHandler._token.verify(token, phone, (tokenId) => {
            if (tokenId) {
                //read user
                data.read('users', phone, (err, userData) => {
                    if (!err, userData) {
                        //delete user
                        data.delete('users', phone, (err1) => {
                            if (!err1) {
                                callBack(200, {
                                    message: 'User Delete Successfully'
                                })
                            } else {
                                callBack(500, {
                                    'error': 'Something is wrong with server'
                                })
                            }
                        })
                    }
                })
            } else {
                callBack(403, {
                    error: 'Authentication Fail'
                })
            }
        })
    } else {
        callBack(500, {
            'error': 'Something is wrong with your request'
        })
    }
};

module.exports = handler;