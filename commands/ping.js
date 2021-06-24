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

    //is an explanation really needed?
    await utils.error(bot, interaction, "Pong :ping_pong:")

};

module.exports.info = {
    "name": "ping",
    "description": "Check if I am alive!"
};
