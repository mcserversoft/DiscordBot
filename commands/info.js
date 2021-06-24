/*
 * ====================NOTE====================
 *    This code was created by LostAndDead,
 *   please don't claim this as your own work
 *        https://github.com/LostAndDead
 * ============================================
 */

const Discord = require("discord.js");
const pjson = require('../package.json');
const utils = require("../utils")

module.exports.run = async(bot, interaction, args) => {

    let embed = new Discord.MessageEmbed()
    .setTitle("MCSS Discord Bot Info:")
    .addField("Basics:", `
    **Description:** ${pjson.description}
    **Version:** ${pjson.version}
    **Owner:** <@209386978481799168>
    **Developer:** <@329353232570908682>
    **Github Code:** https://github.com/mcserversoft/DiscordBot
    **Most Recent Change:** ${pjson.patch}
    `)
    .setColor("0x7ba73f");

    await utils.sendEmbed(bot, interaction, embed)
};

module.exports.info = {
    "name": "info",
    "description": "Get information about the bot"
};
