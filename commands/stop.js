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

    //Get the server guid
    const guid = interaction.options.getString('server')

    //Check if the gui is valid (-1 is used for errors)
    if (guid == "-1"){
        interaction.reply({content: "Unable to connect to MCSS", ephemeral: true});
    }else{
        var data = await MCSS.getServer(guid);

        //Check the server is in a state we can restart it from
        if(data.Status == 1){
            //Stop the server
            await MCSS.executeAction(guid, 2);
            interaction.reply({content: "Sent stop request to server.", ephemeral: true});
        }else if (data == null){
            interaction.respond({content: "Unable to connect to MCSS", ephemeral: true});
        }else{
            interaction.reply({content: "Server is not online therefore can not be stopped", ephemeral: true});
        }
    }
}

module.exports.autocomplete = async(interaction, Config, Client) => {
    //Fetch minimal server info for auto complete
    var data = await MCSS.getServersMinimal();
    if(data == null){
        //Api is unreachable
        interaction.respond([{name: "Unable to connect to MCSS", value: "-1"}]);
    }else{
        var servers = [];
        var value = interaction.options.getFocused(true);
        //Perform a narrow down search on the servers to only get the ones that match the search
        await data.forEach(async (server) => {
            if(server.Name.toLowerCase().includes(value.value.toLowerCase()) || value == ""){
                servers.push({name: server.Name, value: server.Guid});
            }
        });
        //Give the options back to discord
        interaction.respond(servers);
    }
}

module.exports.info = new SlashCommandBuilder()
    .setName('stop')
    .setDefaultPermission(false)
    .setDescription('Stop a server')
    .addStringOption(option => 
        option.setName('server')
        .setDescription('The server to stop')
        .setRequired(true)
    );

//Temp while i wait for builder update
module.exports.extraJSON = {
    options: [
        {
            type: 3,
            name: 'server',
            description: 'The server to stop',
            required: true,
            autocomplete: true
        }
    ]
}