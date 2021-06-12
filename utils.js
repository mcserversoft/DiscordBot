/*
 * ====================NOTE====================
 *    This code was created by LostAndDead,
 *   please don't claim this as your own work
 *        https://github.com/LostAndDead
 * ============================================
 */

const Discord = require("discord.js");
const fs = require("fs");
const yaml = require('js-yaml');
const { config } = require("process");

const opts = {
    errorEventName:'error',
        logDirectory:'./logs', // NOTE: folder must exist and be writable...
        fileNamePattern:'log-<DATE>.log',
        dateFormat:'DD.MM.YYYY'
};
const log = require('simple-node-logger').createRollingFileLogger( opts );

let Config = null;

try {
    let fileContents = fs.readFileSync('./config.yml', 'utf8');
    Config = yaml.load(fileContents);
}
catch (e) {
    console.log(e);
}

async function createAPIMessage(bot, interaction, content){
    const apiMessage = await Discord.APIMessage.create(bot.channels.resolve(interaction.channel_id), content)
        .resolveData()
        .resolveFiles();

    return {...apiMessage.data, files: apiMessage.files};
}

module.exports.log = async (message) => {
    if(Config.Setup.Log){
        log.info(message)
        console.log(message)
    }
}

module.exports.loadData = async() => {
    let rawdata = fs.readFileSync('data.json');
    let data = JSON.parse(rawdata); 
    return data
}

module.exports.saveData = async(data) => {
    writedata = JSON.stringify(data, null, "\t");
    fs.writeFileSync('data.json', writedata);
}

module.exports.sendEmbed = async (bot, interaction, embed) =>{

    let apiMessage = await createAPIMessage(bot, interaction, embed)

    await bot.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
            type: 4,
            data: apiMessage
        }
    })
}

module.exports.sendFollowupEmbed = async (bot, interaction, embed) =>{

    await bot.api.webhooks(bot.user.id, interaction.token).post({
        data: {
            embeds : [
                embed
            ]
        }
    })
}

module.exports.send = async (bot, interaction, message) => {
    await bot.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
            type: 4,
            data: {
                content: message
            }
        }
    })
}

module.exports.sendFollowup = async (bot, interaction, message) => {
    await bot.api.webhooks(bot.user.id, interaction.token).post({
        data: {
            content: message
        }
    })
}

module.exports.loadConfig = async() => {
    try {
        let fileContents = fs.readFileSync('./config.yml', 'utf8');
        return yaml.load(fileContents);
    }
    catch (e) {
        log.info(e);
    }
}

module.exports.error = async(bot, interaction, message) => {
    let embed = new Discord.MessageEmbed()
        .setTitle("❌ Error! ❌")
        .setDescription(message)
        .setColor("0xFF0000");
    
    let apiMessage = await createAPIMessage(bot, interaction, embed)

    await bot.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
            type: 4,
            data: apiMessage
        }
    })
}

module.exports.success = async(bot, interaction, message) => {
    let embed = new Discord.MessageEmbed()
        .setTitle("Success!")
        .setDescription(message)
        .setColor("0x00FF00");
    
    let apiMessage = await createAPIMessage(bot, interaction, embed)

    await bot.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
            type: 4,
            data: apiMessage
        }
    })
}