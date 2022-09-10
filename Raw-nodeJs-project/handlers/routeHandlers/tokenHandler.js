
//dependencies
const data = require('../../library/data');
const { hash, randomString, parseJSON } = require('../../Helpers/utilities');
// module scaffolding
const handler = {};

// about route
handler.tokenHandler = (requiredProperties, callBack) => {
    const acceptedMethod = ['get', 'put', 'post', 'delete'];
    if (acceptedMethod.indexOf(requiredProperties.method) > -1) {
        handler._token[requiredProperties.method](requiredProperties, callBack);
    } else {
        callBack(405);
    }
};

handler._token = {};

handler._token.post = (requiredProperties, callBack) => {
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
    if (phone && password) {
        data.read('users', phone, (err, userData) => {
            let hashPassword = hash(password);
            if (!err && hashPassword === parseJSON(userData).password) {
                const tokenId = randomString(23);
                const expireIn = Date.now() + 60 * 60 * 1000;
                const tokenObject = {
                    phone,
                    id: tokenId,
                    expireIn
                }
                //store token in database
                data.create('tokens', tokenId, tokenObject, (err1) => {
                    if (!err1) {
                        callBack(200, tokenObject);
                    } else {
                        callBack(500, {
                            error: "Server side error..!"
                        })
                    }
                })
            } else {
                callBack(400, {
                    error: "Password is not valid"
                })
            }
        })
    }
};
handler._token.get = (requiredProperties, callBack) => {
    //check token is valid or not.
    const id =
        typeof (requiredProperties.queryObject.id) === 'string'
            && requiredProperties.queryObject.id.trim().length === 23
            ? requiredProperties.queryObject.id
            : false;
    if (id) {
        data.read('tokens', id, (error, token) => {
            const tokenData = { ...parseJSON(token) };
            if (!error && token) {
                callBack(200, tokenData);
            } else {
                callBack(404, {
                    "error": "Requested Token is not found"
                })
            }
        })
    } else {
        callBack(404, {
            "error": "Requested user is not found"
        })
    }
};
handler._token.put = (requiredProperties, callBack) => {
    //check token and extant is valid or not.
    const id =
        typeof (requiredProperties.body.id) === 'string'
            && requiredProperties.body.id.trim().length === 23
            ? requiredProperties.body.id
            : false;
    const extant =
        typeof (requiredProperties.body.extantTo) === 'boolean'
            && requiredProperties.body.extantTo === true
            ? true
            : false;
    if (id && extant) {
        data.read('tokens', id, (error, token) => {
            if (!error && token) {
                let tokenData = parseJSON(token);
                if (tokenData.expireIn > Date.now()) {
                    tokenData.expireIn = Date.now() + 60 * 60 * 1000;
                    //store the updated token
                    data.update('tokens', id, tokenData, (err) => {
                        if (err === "error=false") {
                            callBack(200, {
                                'message': 'Token extant successfully'
                            })
                        } else {
                            callBack(400, {
                                "error": "Server side error."
                            })
                        }
                    })
                } else {
                    callBack(400, {
                        "error": "Requested Token is already expire"
                    })
                }
            } else {
                callBack(500, {
                    'error': 'Something is error in your request'
                })
            }
        })
    } else {
        callBack(500, {
            'error': 'Something is error in your request...!'
        })
    }
};
handler._token.delete = (requiredProperties, callBack) => {
    //check phone number is valid or not.
    const id =
        typeof (requiredProperties.queryObject.id) === 'string'
            && requiredProperties.queryObject.id.trim().length === 23
            ? requiredProperties.queryObject.id
            : false;
    if (id) {
        data.read('tokens', id, (err, tokenData) => {
            if (!err, tokenData) {
                data.delete('tokens', id, (err1) => {
                    if (err1 === "Error on delete = false") {
                        callBack(200, {
                            message: 'Token Delete Successfully'
                        })
                    } else {
                        callBack(500, {
                            'error': 'Something is wrong with server'
                        })
                    }
                })
            } else {
                callBack(500, {
                    'error': 'Something is wrong with your request'
                })
            }
        })
    } else {
        callBack(500, {
            'error': 'Something is wrong with your request'
        })
    }
};
handler._token.verify = (id, phone, callBack) => {
    data.read('tokens', id, (err, tokenData) => {
        if (!err && tokenData) {
            if (parseJSON(tokenData).phone === phone && parseJSON(tokenData).expireIn > Date.now()) {
                callBack(true);
            } else {
                callBack(false);
            }
        } else {
            callBack(false);
        }
    })
}

module.exports = handler;