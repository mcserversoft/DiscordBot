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

    //Get the server guid
    const guid = interaction.options.getString('server')

    //Get the command
    const command = interaction.options.getString('command')

    //Check if the gui is valid (-1 is used for errors)
    if (guid == "-1"){
        commons.error(interaction, "Unable to connect to MCSS");
    }else{
        var data = await MCSS.getServer(guid);

        //Check the server is in a state we can run commands from
        if(data.Status == 1){
            //Run the command
            await MCSS.executeCommand(guid, command);
            var embed = new MessageEmbed()
                .setColor(0x00AE86)
                .setTitle(`🔧    Command executed on ${data.Name}    🔧`)
                .setDescription(`\`${command}\``)
            interaction.reply({embeds: [embed], ephemeral: true});
        }else if (data == null){
            commons.error(interaction, "Unable to connect to MCSS");
        }else{
            commons.error(interaction, "Server is not online therefore commands can not be ran");
        }
    }
}

module.exports.autocomplete = async(interaction, Config, Client) => {
    commons.serverAutoComplete(interaction);
}

module.exports.info = new SlashCommandBuilder()
    .setName('execute')
    .setDefaultPermission(false)
    .setDescription('Execute a command on a server')
    .addStringOption(option => 
        option.setName('server')
        .setDescription('The server to run the command on')
        .setRequired(true)
    )
    .addStringOption(option => 
        option.setName('command')
        .setDescription('The command to run')
        .setRequired(true)
    );

//Temp while i wait for builder update
module.exports.extraJSON = {
    options: [
        {
            type: 3,
            name: 'server',
            description: 'The server to run the command on',
            required: true,
            autocomplete: true
        },
        {
            type: 3,
            name: 'command',
            description: 'The command to run',
            required: true,
        }
    ]
}