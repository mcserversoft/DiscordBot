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
    var data = await MCSS.getVersion();

    var embed = new MessageEmbed()
    if(data == null){
        embed.setTitle("MCSS Status")
        .setColor(0x00AE86)
        .setDescription(`
        **Connected**: 🔴
        **Version**: \`N/A\`
        **API Version**: \`N/A\`
        **Is Dev Build?**: \`N/A\`
        `)
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
    .setName('status')
    .setDefaultPermission(true)
    .setDescription('Get the status for the current MCSS connection')
    .addBooleanOption(option => 
        option.setName('full')
        .setDescription('Show a lot more data')
        .setRequired(false)
    );

module.exports.extraJSON = {}