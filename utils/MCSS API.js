/*
 * ====================NOTE====================
 *    This code was created by LostAndDead,
 *   please don't claim this as your own work
 *        https://github.com/LostAndDead
 * ============================================
 */

const axios = require('axios');
const https = require('https');

//disable ssl check to allow self-signed certs
const instance = axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
})

//Store a bunch of vars in the global scope
var token = null
var connected = false;
var username = null;
var password = null;
var address = null;
var secure = null;

//Setters and authenication
module.exports.init = async (USERNAME, PASSWORD, ENDPOINT, PORT, SECURE) => {

    username = USERNAME;
    password = PASSWORD;
    secure = SECURE ? "s" : ""
    address = `http${secure}://${ENDPOINT}:${PORT}`

    await this.authenticate();

    if (connected) {
        console.log("MCSS API Initialized!");
    }
}

//Authentication
module.exports.authenticate = async () => {

    await this.isConnected();

    //If we are not connected, we can't authenticate
    if (!connected) {
        console.log("MCSS Not Connected!");
        return;
    }

    //Set the header params
    var params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);

    try {
        //Send the request
        await instance.post(`${address}/api/token`, params)
            .then(function(response) {
                //Set the token
                token = response.data.access_token;
                //Set the username
                username = response.data.userName;
            })
    }
    catch (error) {
        console.error("Authentication failed!");
        connected = false;
    }

}

module.exports.isConnected = async () => {

    var state = null;

    try {
        await instance.get(`${address}`, {})
            .then(function(response) {
                if (response.status = 200) {
                    state = true;
                }
                else {
                    state = false;
                }
            })
    }
    catch (error) {
        console.error("MCSS Not Connected!");
        state = false;
    }

    if (state && !connected) {
        connected = state;
        await this.authenticate();
    }

    return state;
}

module.exports.getVersion = async () => {

    await this.isConnected();

    if (!connected) {
        return null;
    }

    var headers = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    var data = null

    try {
        await instance.get(`${address}/api/version`, headers)
            .then(function(response) {
                data = response.data;
            })
    }
    catch (error) {
        return null;
    }

    return data;
}

module.exports.getServersMinimal = async () => {
    await this.isConnected();

    if (!connected) {
        return null;
    }

    var headers = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    var data = null

    try {
        await instance.get(`${address}/api/servers/minimal`, headers)
            .then(function(response) {
                data = response.data;
            })
    }
    catch (error) {
        return null;
    }

    return data;
}

module.exports.getServersFull = async () => {
    await this.isConnected();

    if (!connected) {
        return null;
    }

    var headers = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    var data = null

    try {
        await instance.get(`${address}/api/servers/minimal`, headers)
            .then(function(response) {
                data = response.data;
            })
    }
    catch (error) {
        return null;
    }

    return data;
}

module.exports.getServer = async (guid) => {
    await this.isConnected();

    if (!connected) {
        return null;
    }

    var data = null

    try {
        await instance({
                method: 'get',
                url: `${address}/api/server`,
                headers: {
                    Authorization: `Bearer ${token}`
                },
                data: {
                    "Guid": guid
                }
            })
            .then(function(response) {
                data = response.data;
            })
    }
    catch (error) {
        return null;
    }

    return data;
}

module.exports.executeAction = async (guid, action) => {
    await this.isConnected();

    if (!connected) {
        return null;
    }

    var data = null

    try {
        await instance({
                method: 'post',
                url: `${address}/api/server/execute/action`,
                headers: {
                    Authorization: `Bearer ${token}`
                },
                data: {
                    "Guid": guid,
                    "Action": action
                }
            })
            .then(function(response) {
                data = response.data;
            })
    }
    catch (error) {
        return null;
    }

    return data;
}

module.exports.executeCommand = async (guid, command) => {
    await this.isConnected();

    if (!connected) {
        return null;
    }

    var data = null

    try {
        await instance({
                method: 'post',
                url: `${address}/api/server/execute/command`,
                headers: {
                    Authorization: `Bearer ${token}`
                },
                data: {
                    "Guid": guid,
                    "Command": command
                }
            })
            .then(function(response) {
                data = response.data;
            })
    }
    catch (error) {
        return null;
    }

    return data;
}

module.exports.getServersCount = async () => {
    await this.isConnected();

    if (!connected) {
        return null;
    }

    var headers = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    var data = null

    try {
        await instance.get(`${address}/api/servers/count`, headers)
            .then(function(response) {
                data = response.data;
            })
    }
    catch (error) {
        return null;
    }

    return data;
}

module.exports.getServersCountOnline = async () => {
    await this.isConnected();

    if (!connected) {
        return null;
    }

    var headers = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    var data = null

    try {
        await instance.get(`${address}/api/servers/count/online`, headers)
            .then(function(response) {
                data = response.data;
            })
    }
    catch (error) {
        return null;
    }

    return data;
}

module.exports.resolveStatus = async (status) => {
    switch (status) {
        case 0:
            {
                return {
                    Message: "Offline",
                    Emoji: "🔴"
                }
            }
        case 1:
            {
                return {
                    Message: "Online",
                    Emoji: "🟢"
                }
            }
        case 2:
            {
                return {
                    Message: "Unknown",
                    Emoji: "🟡"
                }
            }
        case 3:
            {
                return {
                    Message: "Starting",
                    Emoji: "🟡"
                }
            }
        case 4:
            {
                return {
                    Message: "Stopping",
                    Emoji: "🟡"
                }
            }
    }
}

module.exports.resolveKeepOnline = async (status) => {
    switch (status) {
        case 0:
            {
                return "None"
            }
        case 1:
            {
                return "Elevated"
            }
        case 2:
            {
                return "Aggressive"
            }
    }
}