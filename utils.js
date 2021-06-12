/*
 * ====================NOTE====================
 *    This code was created by LostAndDead,
 *   please don't claim this as your own work
 *        https://github.com/LostAndDead
 * ============================================
 */

const Discord = require("discord.js");

async function createAPIMessage(bot, interaction, content){
    const apiMessage = await Discord.APIMessage.create(bot.channels.resolve(interaction.channel_id), content)
        .resolveData()
        .resolveFiles();

    return {...apiMessage.data, files: apiMessage.files};
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

module.exports.error = async(bot, interaction, message) => {

    await bot.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
            type: 4,
            data: {
                content: message,
                flags: 64
            }
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

module.exports.setLoading = async(bot, interaction) => {
    msg = await bot.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
            type: 5,
        }
    })
}

module.exports.respondLoading = async(bot, interaction, message) => {
    await bot.api.webhooks(bot.user.id, interaction.token).messages("@original").patch({
        data: {
            type: 4,
            content: message
        }
    })
}

module.exports.respondLoadingEmbed = async(bot, interaction, embed) => {

    let embedAPI = await createAPIMessage(bot, interaction, embed)

    await bot.api.webhooks(bot.user.id, interaction.token).messages("@original").patch({
        data: {
            type: 4,
            embeds: [
                embedAPI.embed
            ]
        }
    })
}