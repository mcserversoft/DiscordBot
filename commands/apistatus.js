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
    var data = await MCSS.getVersion();

    //Create the embed
    var embed = new MessageEmbed()
    if(data == null){
        //Api is unreachable
        commons.error(interaction, "Unable to connect to MCSS");
    }else{
        embed.setTitle("MCSS Status")
        .setColor(0x00AE86)
        .setDescription(`
        **Connected**: 🟢
        **Version**: \`${data.McssVersion}\`
        **API Version**: \`${data.McssApiVersion}\`
        **Is Dev Build?**: \`${data.IsDevBuild}\`
        `)
    }
    
    interaction.reply({embeds: [embed]});

}

module.exports.info = new SlashCommandBuilder()
    .setName('apistatus')
    .setDefaultPermission(true)
    .setDescription('Get the status for the current MCSS connection');

module.exports.extraJSON = {}