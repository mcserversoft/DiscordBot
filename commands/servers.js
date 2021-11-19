/*
 * ====================NOTE====================
 *    This code was created by LostAndDead,
 *   please don't claim this as your own work
 *        https://github.com/LostAndDead
 * ============================================
 */

const { SlashCommandBuilder} = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js')
const MCSS = require('../utils/MCSS API');

module.exports.run = async(interaction, Config, Client) => {
    var data = await MCSS.getServersMinimal();

    var embed = new MessageEmbed()
    if(data == null){
        embed.setTitle("Servers")
        .setColor(0x00AE86)
        .setDescription(`Unable to connect to MCSS`)
    }else{
        var online = await MCSS.getServersCountOnline()
        var total = await MCSS.getServersCount()
        embed.setTitle("Servers")
        .setDescription (`${online}/${total} Online`)
        .setColor(0x00AE86)

        await data.forEach(async (server) => {
            var status = await MCSS.resolveStatus(server.Status)
            embed.addField(`${server.Name}`, 
            `
            **GUID**: \`${server.Guid}\`
            **Status**: ${status.Emoji}
            `)
        });
    }

    interaction.reply({embeds: [embed]})
}

module.exports.info = new SlashCommandBuilder()
    .setName('servers')
    .setDefaultPermission(false)
    .setDescription('Get a basic info on all servers');

module.exports.extraJSON = {}