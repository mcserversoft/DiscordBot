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

    //Fetch the GUID from the command
    const guid = interaction.options.getString('server')

    //Check if the gui is valid (-1 is used for errors)
    if (guid == "-1"){
        commons.error(interaction, "Unable to connect to MCSS");
    }else{
        var data = await MCSS.getServer(guid);

        if(data == null){
            commons.error(interaction, "Unable to connect to MCSS");
        } else {

            //Resolve some varibles to useable values
            var status = await MCSS.resolveStatus(data.Status)
            var keepOnline = await MCSS.resolveKeepOnline(data.KeepOnline)

            //Create the embed
            var embed = new MessageEmbed()
            .setTitle(data.Name)
            .setColor(0x00AE86)
            .setDescription(`
            **Guid**: \`${data.Guid}\`
            **Status**: \`${status.Message}\` ${status.Emoji}
            **Description**: \`${data.Description ? data.Description : ' '}\`
            **Path To Folder**: \`${data.PathToFolder}\`
            **Folder Name**: \`${data.FolderName}\`
            **Creation Date**: \`${data.CreationDate}\`
            **Auto Start?**: \`${data.IsSetToAutoStart}\`
            **Keep Online?**: \`${keepOnline}\`
            **Allocated Memory**: \`${data.JavaAllocatedMemory}\`
            **Startup Line**: \`${data.JavaStartupLine}\`
            `)

            interaction.reply({embeds: [embed]});
        }
    }
}

module.exports.autocomplete = async(interaction) => {
    commons.serverAutoComplete(interaction);
}

module.exports.info = new SlashCommandBuilder()
    .setName('server')
    .setDefaultPermission(false)
    .setDescription('Get more detailed info on a specific server')
    .addStringOption(option => 
        option.setName('server')
        .setDescription('The server to get info on')
        .setRequired(true)
    );

//Temp while i wait for builder update
module.exports.extraJSON = {
    options: [
        {
            type: 3,
            name: 'server',
            description: 'The server to get info on',
            required: true,
            autocomplete: true
        }
    ]
}