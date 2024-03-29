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
    const guid = interaction.options.getString('server')

    //Check if the gui is valid (-1 is used for errors)
    if (guid == "-1"){
        commons.error(interaction, "Unable to connect to MCSS");
    }else{
        var data = await MCSS.getServer(guid);

        //Check the server is in a state we can restart it from
        if(data.Status == 0){
            //Start the server
            await MCSS.executeAction(guid, 1);
            commons.success(interaction, `🟢    Started ${data.Name}    🟢`);
        }else if (data == null){
            commons.error(interaction, "Unable to connect to MCSS");
        }else{
            commons.error(interaction, "Server is not offline therefore can not be started");
        }
    }
}

module.exports.autocomplete = async(interaction, Config, Client) => {
    commons.serverAutoComplete(interaction);
}

module.exports.info = new SlashCommandBuilder()
    .setName('start')
    .setDefaultPermission(false)
    .setDescription('Start a server')
    .addStringOption(option => 
        option.setName('server')
        .setDescription('The server to start')
        .setRequired(true)
    );

//Temp while i wait for builder update
module.exports.extraJSON = {
    options: [
        {
            type: 3,
            name: 'server',
            description: 'The server to start',
            required: true,
            autocomplete: true
        }
    ]
}