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

        //Check the server is in a state we can restart it from
        if(data.Status == 1){
            //Restart the server
            await MCSS.executeAction(guid, 3);
            commons.success(interaction, `🟡    Restarted ${data.Name}    🟡`);
        }else if (data == null){
            commons.error(interaction, "Unable to connect to MCSS");
        }else{
            commons.error(interaction, "Server is not online therefore can not be restarted");
        }
    }
}

module.exports.autocomplete = async(interaction, Config, Client) => {
    commons.serverAutoComplete(interaction);
}

module.exports.info = new SlashCommandBuilder()
    .setName('restart')
    .setDefaultPermission(false)
    .setDescription('Restart a server')
    .addStringOption(option => 
        option.setName('server')
        .setDescription('The server to restart')
        .setRequired(true)
    );

//Temp while i wait for builder update
module.exports.extraJSON = {
    options: [
        {
            type: 3,
            name: 'server',
            description: 'The server to restart',
            required: true,
            autocomplete: true
        }
    ]
}