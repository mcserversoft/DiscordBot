/*
 * ====================NOTE====================
 *    This code was created by LostAndDead,
 *   please don't claim this as your own work
 *        https://github.com/LostAndDead
 * ============================================
 */

const { SlashCommandBuilder} = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')
const MCSS = require('../utils/MCSS API');

module.exports.run = async(interaction, Config, Client) => {

    //Fetch the GUID from the command
    const guid = interaction.options.getString('server')

    //Create the buttons for the confirm
    const row = new MessageActionRow()
    row.addComponents(
        new MessageButton()
        .setLabel("I am sure!")
        .setCustomId(`kill.yes.${guid}`)
        .setEmoji("💀")
        .setStyle('DANGER')
    )
    row.addComponents(
        new MessageButton()
        .setLabel("Na, I'm good thanks")
        .setCustomId(`kill.no.${guid}`)
        .setEmoji("🚶")
        .setStyle('SUCCESS')
    )

    //Send the confirmation dialog
    interaction.reply({content: "**Are you sure you wish to do this?**\n\n*Killing a server can have severe consequences!*", components: [row], ephemeral: true })
}

module.exports.callButton = async(interaction, Config, Client, button) => {

    //Fetch the action and the guid from the custom id
    var action = interaction.customId.split('.')[1]
    var guid = interaction.customId.split('.')[2]

    switch (action){
        case "yes":{
            //Check if the gui is valid (-1 is used for errors)
            if (guid == "-1"){
                interaction.reply({content: "Unable to connect to MCSS", ephemeral: true});
            }else{
                //Kill the server
                await MCSS.executeAction(guid, 4);
                interaction.reply({content: "Sent kill request to server.", ephemeral: true});
            }
            break;
        }
        case "no":{
            //They chickened out, just send a message
            interaction.update({content: 'Kill action denied', components: []})
            break;
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
    .setName('kill')
    .setDefaultPermission(false)
    .setDescription('Kill a server')
    .addStringOption(option => 
        option.setName('server')
        .setDescription('The server to kill')
        .setRequired(true)
    );

//Temp while i wait for builder update
module.exports.extraJSON = {
    options: [
        {
            type: 3,
            name: 'server',
            description: 'The server to kill',
            required: true,
            autocomplete: true
        }
    ]
}