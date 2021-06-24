/*
 * ====================NOTE====================
 *    This code was created by LostAndDead,
 *   please don't claim this as your own work
 *        https://github.com/LostAndDead
 * ============================================
 */

const Discord = require("discord.js");
const utils = require("../utils")

module.exports.run = async(bot, interaction, args) => {

    //create link
    console.log(args.query)
    let link = `https://letmegooglethat.com/?q=${encodeURIComponent(args[0].value)}`;
    let embed = new Discord.MessageEmbed()
    .addField("**It seems like your problem could be solved with a simple Google search.**", `[View answer to: ${args[0].value}](${link})`)
    .setColor("0x7ba73f");

    await utils.sendEmbed(bot, interaction, embed)

};

module.exports.info = {
    "name": "lmgt",
    "description": "Can something be solved by a simple Google search? Use this then!",
    "options": [
        {
            "name": "query",
            "description": "What do you want me to Google for you?",
            "type": 3,
            "required": true
        }
    ]
};
