/*
 * ====================NOTE====================
 *    This code was created by LostAndDead,
 *   please don't claim this as your own work
 *        https://github.com/LostAndDead
 * ============================================
 */

const fetch = require("node-fetch")
const { promisify } = require('util')
const sleep = promisify(setTimeout)

module.exports.sendCalls = async(bot, calls) => {

    if(!process.env.SETUPCOMMANDS){
        return
    }

    let apiEndpoint = `https://discord.com/api/v8/applications/${bot.user.id}/guilds/${process.env.GUILDID}/commands`
    console.log("Submitting commands")

    console.log("This will take a bit to avoiding rate limiting")

    var x = 1
    for(let command of calls){

        if(calls.length >= 7){
            await sleep(4000)
        }

        let res = await fetch(apiEndpoint, {
            method: "post",
            body: JSON.stringify(command),
            headers: {
                "Authorization": "Bot " + process.env.TOKEN,
                "Content-Type": "application/json"
            }
        })

        const json = await res.json()
        if(json.code || json.message){
            console.log(json)
        }else{
            console.log(x + "/"+ calls.length)
            x++
        }
    }
}
