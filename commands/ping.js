/*
 * ====================NOTE====================
 *    This code was created by LostAndDead,
 *   please don't claim this as your own work
 *        https://github.com/LostAndDead
 * ============================================
 */

const { SlashCommandBuilder} = require('@discordjs/builders');

module.exports.run = async(interaction, Config, Client) => {
    interaction.reply({content: `Pong! :ping_pong: \nLatency \`${Client.ws.ping}\`ms`, ephemeral: true})
}

module.exports.info = new SlashCommandBuilder()
    .setName('ping')
    .setDefaultPermission(true)
    .setDescription('Ping me!');

module.exports.extraJSON = {}