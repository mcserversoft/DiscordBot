const axios = require('axios');

//Store a bunch of vars in the global scope
var token = null
var connected = false;
var username = null;
var password = null;
var endpoint = null;
var port = null;

//Setters and authenication
module.exports.init = async (USERNAME, PASSWORD, ENDPOINT, PORT) => {

    username = USERNAME;
    password = PASSWORD;
    endpoint = ENDPOINT;
    port = PORT;

    await this.authenticate();
}

//Authentication
module.exports.authenticate = async () => {

    await this.isConnected();

    //If we are not connected, we can't authenticate
    if(!connected){
        console.log("MCSS Not Connected!");
        return;
    }

    //Set the header params
    var params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);

    try {
        //Send the request
        await axios.post(`http://${endpoint}:${port}/api/token`, params)
        .then(function (response) {
            //Set the token
            token = response.data.access_token;
            //Set the username
            username = response.data.userName;
            console.log(`Authenticated as ${username}`);
        })
    }catch (error){
        console.error("Authentication failed!");
        connected = false;
    }
    
}

module.exports.isConnected = async () => {

    try{
        await axios.get(`http://${endpoint}:${port}/mcss`, {})
        .then(function (response) {
            if(response.data = "MCSS API says hello!"){
                connected = true;
            }else{
                connected = false;
            }
        })
    }catch (error){
        console.error("MCSS Not Connected!");
        connected = false;
    }

    return connected;
}

module.exports.getVersion = async () => {

    await this.isConnected();

    if(!connected){
        return null;
    }

    var headers = {
        headers: { Authorization: `Bearer ${token}` }
    };

    var data = null

    try {
        await axios.get(`http://${endpoint}:${port}/api/version`, headers)
        .then(function (response) {
            data = response.data;
        })
    }catch (error){
        return null;
    }

    return data;
}

module.exports.getServersMinimal = async () => {
    await this.isConnected();

    if(!connected){
        return null;
    }

    var headers = {
        headers: { Authorization: `Bearer ${token}` }
    };

    var data = null

    try {
        await axios.get(`http://${endpoint}:${port}/api/servers/minimal`, headers)
        .then(function (response) {
            data = response.data;
        })
    }catch (error){
        return null;
    }

    return data;
}

module.exports.getServersFull = async () => {
    await this.isConnected();

    if(!connected){
        return null;
    }

    var headers = {
        headers: { Authorization: `Bearer ${token}` }
    };

    var data = null

    try {
        await axios.get(`http://${endpoint}:${port}/api/servers/minimal`, headers)
        .then(function (response) {
            data = response.data;
        })
    }catch (error){
        return null;
    }

    return data;
}

module.exports.getServer = async (guid) => {
    await this.isConnected();

    if(!connected){
        return null;
    }

    var data = null

    try {
        await axios({
            method: 'get',
            url: `http://${endpoint}:${port}/api/server`,
            headers: { Authorization: `Bearer ${token}` },
            data : {
                "Guid": guid
            }
        })
        .then(function (response) {
            data = response.data;
        })
    }catch (error){
        console.log(error);
        return null;
    }

    return data;
}

module.exports.executeAction = async (guid, action) => {
    await this.isConnected();

    if(!connected){
        return null;
    }

    var data = null

    try {
        await axios({
            method: 'post',
            url: `http://${endpoint}:${port}/api/server/execute/action`,
            headers: { Authorization: `Bearer ${token}` },
            data : {
                "Guid": guid,
                "Action": action
            }
        })
        .then(function (response) {
            data = response.data;
        })
    }catch (error){
        console.log(error);
        return null;
    }

    return data;
}

module.exports.getServersCount = async () => {
    await this.isConnected();

    if(!connected){
        return null;
    }

    var headers = {
        headers: { Authorization: `Bearer ${token}` }
    };

    var data = null

    try {
        await axios.get(`http://${endpoint}:${port}/api/servers/count`, headers)
        .then(function (response) {
            data = response.data;
        })
    }catch (error){
        return null;
    }

    return data;
}

module.exports.getServersCountOnline = async () => {
    await this.isConnected();

    if(!connected){
        return null;
    }

    var headers = {
        headers: { Authorization: `Bearer ${token}` }
    };

    var data = null

    try {
        await axios.get(`http://${endpoint}:${port}/api/servers/count/online`, headers)
        .then(function (response) {
            data = response.data;
        })
    }catch (error){
        return null;
    }

    return data;
}

module.exports.resolveStatus = async (status) => {
    switch(status){
        case 0:{
            return {Message: "Offline", Emoji: "🔴"}
        }
        case 1:{
            return {Message: "Online", Emoji: "🟢"}
        }
        case 2:{
            return {Message: "Unknown", Emoji: "🟡"}
        }
        case 3:{
            return {Message: "Starting", Emoji: "🟡"}
        }
        case 4:{
            return {Message: "Stopping", Emoji: "🟡"}
        }
    }
}

module.exports.resolveKeepOnline = async (status) => {
    switch(status){
        case 0:{
            return "None"
        }
        case 1:{
            return "Elevated"
        }
        case 2:{
            return "Aggressive"
        }
    }
}