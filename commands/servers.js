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
const commons = require('../utils/commons');

module.exports.run = async(interaction, Config, Client) => {

    //Get minimal server data
    var data = await MCSS.getServersMinimal();

    var embed = new MessageEmbed()
    if(data == null){
        //Api is unreachable
        commons.error(interaction, "Unable to connect to MCSS");
    }else{
    
        //Resolve some varibles to useable values
        var online = await MCSS.getServersCountOnline()
        var total = await MCSS.getServersCount()

        //Create the embed
        embed.setTitle("Servers")
        .setDescription (`${online}/${total} Online`)
        .setColor(0x00AE86)

        //Loop through the servers
        await data.forEach(async (server) => {
            var status = await MCSS.resolveStatus(server.Status)
            embed.addField(`${server.Name}`, 
            `
            **GUID**: \`${server.Guid}\`
            **Status**: \`${status.Message}\` ${status.Emoji}
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