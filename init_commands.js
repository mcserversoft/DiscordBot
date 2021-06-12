/*
 * ====================NOTE====================
 *    This code was created by LostAndDead,
 *   please don't claim this as your own work
 *        https://github.com/LostAndDead
 * ============================================
 */

const yaml = require('js-yaml');
const fs = require("fs");
const fetch = require("node-fetch")
const utils = require('./utils');
const { promisify } = require('util')
const sleep = promisify(setTimeout)

module.exports.sendCalls = async(bot, calls) => {

    let Config = await utils.loadConfig()

    if(!Config.Commands.SetupCommands){
        return
    }

    let apiEndpoint
    if (Config.Commands.JustGuildCommands) {
        apiEndpoint = `https://discord.com/api/v8/applications/${bot.user.id}/guilds/${Config.Commands.GuildID}/commands`
        console.log("Submitting commands to guild only")
    }else {
        apiEndpoint = `https://discord.com/api/v8/applications/${bot.user.id}/commands`
        console.log("Submitting commands GLOBALY")
    }

    console.log("This will take a bit to avoiding rate limiting")

    var x = 1
    for(let command of calls){

        await sleep(4000)

        let res = await fetch(apiEndpoint, {
            method: "post",
            body: JSON.stringify(command),
            headers: {
                "Authorization": "Bot " + Config.Setup.Token,
                "Content-Type": "application/json"
            }
        })

        const json = await res.json()
        if(json.code || json.message){
            utils.log(json)
        }else{
            console.log(x + "/"+ calls.length)
            x++
        }
    }
}
